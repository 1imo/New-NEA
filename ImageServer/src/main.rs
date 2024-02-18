use axum::{
    body::Body, extract::{Json, Path, Query}, http::{header::CONTENT_TYPE, HeaderMap, HeaderValue, Method, StatusCode}, response::{IntoResponse, Response}, routing::{delete, get, post}, Router
};
use serde::{Serialize, Deserialize};
use tower_http::cors::{Any, CorsLayer};
use std::{fs::File, io::Read, path::PathBuf};
use std::io::Write;
use mime_guess::guess_mime_type;

#[derive(Debug, Deserialize)]
enum UploadType {
    Profile,
    Post
}

#[derive(Debug, Deserialize)]
struct Payload {
    id: String,
    image: String,
    correlation: UploadType
}

#[derive(Debug, Deserialize)]
struct Request {
    id: String,
    correlation: UploadType
}


async fn upload_image(Json(payload): Json<Payload>) -> String {
    let image_data = payload.image;
    let image_bytes: Vec<u8> = image_data.split(',').map(|num| num.parse::<u8>().expect("Invalid number in string")).collect();

    match payload.correlation {
        UploadType::Post => {
            let file_path = format!("post/{}.jpg", payload.id);
            println!("{:?}", file_path);
            let mut file = File::create(&file_path).expect("Error creating image file");
            println!("{:?}", file);
            file.write_all(&image_bytes).expect("Error writing image data");
            "".to_owned()
        },
        UploadType::Profile => {
            let file_path = format!("profile/{}.jpg", payload.id);
            println!("{:?}", file_path);
            let mut file = File::create(&file_path).expect("Error creating image file");
            println!("{:?}", file);
            file.write_all(&image_bytes).expect("Error writing image data");
            "".to_owned()
        }
    }


}

async fn send_image(Path((type_id, id)): Path<(String, String)>) -> Response<Body> {
    println!("hi {} {}", type_id, id);

    let mut file_path = PathBuf::from("");
    let type_id = type_id.as_str();

    match type_id {
        "post" => {
            file_path.push("post");
        },
        "profile" => {
            file_path.push("profile");
        },
        _ => {
            return Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from("Invalid image type"))
                .unwrap();
        }
    }
    file_path.push(format!("{}.jpg", id));

    if !file_path.exists() {
        return Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::empty())
            .unwrap();
    }


    let mut file = File::open(file_path).expect("Error opening image file");
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).expect("Error reading image data");



    Response::builder()
        .status(StatusCode::OK)
        .body(Body::from(buffer))
        .unwrap()
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/upload", post(upload_image))
        .route("/fetch/:type_id/:id", get(send_image))
        .layer(cors);

    println!("Running on http://localhost:3000");

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}