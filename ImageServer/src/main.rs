// Import dependencies
use axum::{
    body::Body,
    extract::{Json, Path, Query},
    http::{header::CONTENT_TYPE, HeaderMap, HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{delete, get, post},
    Router,
};
use serde::{Serialize, Deserialize};
use tower_http::cors::{Any, CorsLayer};
use std::{fs::File, io::Read, path::PathBuf};
use std::io::Write;
use mime_guess::guess_mime_type;

// Enum representing different upload types
#[derive(Debug, Deserialize)]
enum UploadType {
    Profile,
    Post,
    Chat,
}

// Payload struct representing the body of a request to upload data
#[derive(Debug, Deserialize)]
struct Payload {
    id: String,
    image: String,
    correlation: UploadType,
}

// Request struct representing a request to fetch data
#[derive(Debug, Deserialize)]
struct Request {
    id: String,
    correlation: UploadType,
}

// Handler function for uploading an image
async fn upload_image(Json(payload): Json<Payload>) -> String {
    // Extract the image data from the payload
    let image_data = payload.image;

    // Convert the image data string to a vector of bytes
    let image_bytes: Vec<u8> = image_data
        .split(',')
        .map(|num| num.parse::<u8>().expect("Invalid number in string"))
        .collect();

    println!("{:?}", payload.correlation);

    // Match on the correlation type to determine where to save the image
    match payload.correlation {
        UploadType::Post => {
            // Generate the file path for a post image
            let file_path = format!("post/{}.jpg", payload.id);
            
            // Create a new file at the specified file path
            let mut file = File::create(&file_path).expect("Error creating image file");
            
            // Write the image bytes to the file
            file.write_all(&image_bytes).expect("Error writing image data");
            
            // Return an empty string as a success response
            "".to_owned()
        }
        UploadType::Profile => {
            // Generate the file path for a profile image
            let file_path = format!("profile/{}.jpg", payload.id);
            
            // Create a new file at the specified file path
            let mut file = File::create(&file_path).expect("Error creating image file");
            
            // Write the image bytes to the file
            file.write_all(&image_bytes).expect("Error writing image data");
            
            // Return an empty string as a success response
            "".to_owned()
        }
        UploadType::Chat => {
            // Generate the file path for a chat image
            let file_path = format!("chat/{}.jpg", payload.id);
            
            // Create a new file at the specified file path
            let mut file = File::create(&file_path).expect("Error creating image file");
            
            // Write the image bytes to the file
            file.write_all(&image_bytes).expect("Error writing image data");
            
            // Return an empty string as a success response
            "".to_owned()
        }
    }
}

// Handler function for sending an image
async fn send_image(Path((type_id, id)): Path<(String, String)>) -> Response<Body> {
    // Create a new PathBuf to store the file path
    let mut file_path = PathBuf::from("");
    
    // Convert the type_id to a string slice
    let type_id = type_id.as_str();

    println!("{:?}", type_id);

    // Match on the type_id to determine the file path prefix
    match type_id {
        "post" => {
            file_path.push("post");
        }
        "profile" => {
            file_path.push("profile");
        }
        "chats" => {
            file_path.push("chat");
        }
        _ => {
            // Return a bad request response if the type_id is invalid
            return Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from("Invalid image type"))
                .unwrap();
        }
    }

    // Append the id and file extension to the file path
    file_path.push(format!("{}.jpg", id));

    // Check if the file exists at the specified file path
    if !file_path.exists() {
        // Return a not found response if the file doesn't exist
        return Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::empty())
            .unwrap();
    }

    // Open the file at the specified file path
    let mut file = File::open(file_path).expect("Error opening image file");
    
    // Create a new buffer to store the file contents
    let mut buffer = Vec::new();
    
    // Read the entire file into the buffer
    file.read_to_end(&mut buffer).expect("Error reading image data");

    // Return a successful response with the image data as the body
    Response::builder()
        .status(StatusCode::OK)
        .body(Body::from(buffer))
        .unwrap()
}

#[tokio::main]
async fn main() {
    // Create a new CorsLayer with allowed methods, headers, and origin
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    // Create a new Router and define the routes and their corresponding handlers
    let app = Router::new()
        .route("/upload", post(upload_image))
        .route("/fetch/:type_id/:id", get(send_image))
        .layer(cors);

    println!("Running on http://localhost:3000");

    // Start the server and handle incoming requests
    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}