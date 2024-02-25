use std::collections::{HashMap, HashSet};

use axum::{
    body::Body,
    extract::Json,
    http::{Method, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use tower_http::cors::{Any, CorsLayer};

#[derive(Debug, Deserialize, Serialize)]
struct User {
    id: String,
    friends: Option<Vec<String>>,
    following: Option<Vec<String>>,
}

impl User {
    // Function to create connections on the graph
    fn create_connection(&self, graph: &mut HashMap<String, HashSet<String>>) {
        if let Some(friends) = &self.friends {
            for friend_id in friends {
                graph.entry(self.id.clone()).or_insert(HashSet::new()).insert(friend_id.clone());
                graph.entry(friend_id.clone()).or_insert(HashSet::new()).insert(self.id.clone());
            }
        }
        if let Some(following) = &self.following {
            for follow_id in following {
                graph.entry(self.id.clone()).or_insert(HashSet::new()).insert(follow_id.clone());
                graph.entry(follow_id.clone()).or_insert(HashSet::new()).insert(self.id.clone());
            }
        }
    }

    fn find_mutual_connections(&self, graph: &HashMap<String, HashSet<String>>) -> HashMap<String, usize> {
        let mut mutual_connections: HashMap<String, usize> = HashMap::new();

        if let Some(connections) = graph.get(&self.id) {
            for connection_id in connections {
                if let Some(connections_of_connection) = graph.get(connection_id) {
                    for mutual_connection_id in connections_of_connection {
                        if mutual_connection_id != &self.id && !connections.contains(mutual_connection_id) {
                            *mutual_connections.entry(mutual_connection_id.clone()).or_insert(0) += 1;
                        }
                    }
                }
            }
        }

        mutual_connections
    }
}



async fn recommend(Json(users): Json<Vec<User>>) -> impl IntoResponse {
    println!("{:?}", users);

    let mut graph: HashMap<String, HashSet<String>> = HashMap::new();
    for user in &users {
        user.create_connection(&mut graph);
    }

    println!("{:#?}", graph);

    if let Some(user) = users.first() {
        let mut mutual_connections = user.find_mutual_connections(&graph);

        if let Some(direct_connections) = graph.get(&user.id) {
            for connection in direct_connections {
                mutual_connections.remove(connection);
            }
        }

        let mut sorted_mutual_connections: Vec<String> = mutual_connections
            .into_iter()
            .map(|(id, _)| id)
            .collect();

        sorted_mutual_connections.sort_by_key(|user_id| user_id.len());
        sorted_mutual_connections.reverse();

        

        println!("{:?}", sorted_mutual_connections.clone());

        let body = match to_string(&sorted_mutual_connections) {
            Ok(json_string) => Body::from(json_string),
            Err(error) => {
                eprintln!("Error converting to JSON: {:?}", error);
                Body::empty()
            }
        };

        return Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(body)
            .unwrap();
    }

    Response::builder()
        .status(StatusCode::OK)
        .body(Body::empty())
        .unwrap()
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
    
        .route("/recommend", post(recommend))
        .layer(cors);

    println!("Running on http://localhost:3001");

    axum::Server::bind(&"127.0.0.1:3001".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
