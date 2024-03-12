// Import dependencies
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

// User struct represents a user with their id, friends, and following
#[derive(Debug, Deserialize, Serialize)]
struct User {
    id: String,
    friends: Option<Vec<String>>,
    following: Option<Vec<String>>,
}

impl User {
    // Function to create connections on the graph
    fn create_connection(&self, graph: &mut HashMap<String, HashSet<String>>) {
        // Add friends to the graph
        if let Some(friends) = &self.friends {
            for friend_id in friends {
                graph.entry(self.id.clone()).or_insert(HashSet::new()).insert(friend_id.clone());
                graph.entry(friend_id.clone()).or_insert(HashSet::new()).insert(self.id.clone());
            }
        }
        // Add followings to the graph
        if let Some(following) = &self.following {
            for follow_id in following {
                graph.entry(self.id.clone()).or_insert(HashSet::new()).insert(follow_id.clone());
                graph.entry(follow_id.clone()).or_insert(HashSet::new()).insert(self.id.clone());
            }
        }
    }

    // Function to find mutual connections for a user
    fn find_mutual_connections(&self, graph: &HashMap<String, HashSet<String>>) -> HashMap<String, usize> {
        let mut mutual_connections: HashMap<String, usize> = HashMap::new();
        // Check if the user has any connections
        if let Some(connections) = graph.get(&self.id) {
            // Iterate over each connection of the user
            for connection_id in connections {
                // Check if the connection has any connections
                if let Some(connections_of_connection) = graph.get(connection_id) {
                    // Iterate over each connection of the connection
                    for mutual_connection_id in connections_of_connection {
                        // Check if the mutual connection is not the user itself and not a direct connection
                        if mutual_connection_id != &self.id && !connections.contains(mutual_connection_id) {
                            // Increment the count of mutual connections
                            *mutual_connections.entry(mutual_connection_id.clone()).or_insert(0) += 1;
                        }
                    }
                }
            }
        }
        mutual_connections
    }
}

// Route handler for recommendations
async fn recommend(Json(users): Json<Vec<User>>) -> impl IntoResponse {
    let mut graph: HashMap<String, HashSet<String>> = HashMap::new();
    // Create connections for each user in the graph
    for user in &users {
        user.create_connection(&mut graph);
    }
    // Check if there is at least one user
    if let Some(user) = users.first() {
        let mut mutual_connections = user.find_mutual_connections(&graph);
        // Remove direct connections from mutual connections
        if let Some(direct_connections) = graph.get(&user.id) {
            for connection in direct_connections {
                mutual_connections.remove(connection);
            }
        }
        // Sort mutual connections by the length of user id in descending order
        let mut sorted_mutual_connections: Vec<String> = mutual_connections
            .into_iter()
            .map(|(id, _)| id)
            .collect();
        sorted_mutual_connections.sort_by_key(|user_id| user_id.len());
        sorted_mutual_connections.reverse();
        // Convert sorted mutual connections to JSON
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
    // Return an empty response if there are no users
    Response::builder()
        .status(StatusCode::OK)
        .body(Body::empty())
        .unwrap()
}

#[tokio::main]
async fn main() {
    // Create a CORS layer allowing GET and POST methods, any headers, and any origin
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);
    // Create a router and register the recommend route
    let app = Router::new()
        .route("/recommend", post(recommend))
        .layer(cors);
    // Print the server running message
    println!("Running on http://localhost:3001");
    // Start the server
    axum::Server::bind(&"127.0.0.1:3001".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}