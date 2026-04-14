# # # # # import base64
# # # # # import os
# # # # # import logging
# # # # # from collections import Counter

# # # # # import numpy as np
# # # # # from PIL import Image
# # # # # from fastapi import FastAPI, HTTPException, Request, UploadFile, File
# # # # # from fastapi.middleware.cors import CORSMiddleware
# # # # # from fastapi.responses import JSONResponse
# # # # # from fastapi.templating import Jinja2Templates

# # # # # import functions as f
# # # # # import skin_model as m

# # # # # # Configure logging
# # # # # logging.basicConfig(level=logging.INFO)
# # # # # logger = logging.getLogger(__name__)

# # # # # app = FastAPI()

# # # # # origins = [
# # # # #     "http://localhost:3000",  # Your frontend application (if any)
# # # # #     "http://localhost:8000"   # Your FastAPI application
# # # # # ]

# # # # # app.add_middleware(
# # # # #     CORSMiddleware,
# # # # #     allow_origins=origins,
# # # # #     allow_credentials=True,
# # # # #     allow_methods=["*"],
# # # # #     allow_headers=["*"],
# # # # # )

# # # # # templates = Jinja2Templates(directory="templates")

# # # # # @app.get("/", response_class=JSONResponse)
# # # # # async def read_root(request: Request):
# # # # #     logger.info("Serving root endpoint.")
# # # # #     return templates.TemplateResponse("index.html", {"request": request})

# # # # # @app.post("/upload_image")
# # # # # async def upload_image(file: UploadFile = File(...)):
# # # # #     try:
# # # # #         logger.info("Received image upload request.")
# # # # #         contents = await file.read()
# # # # #         print(contents)
# # # # #         image_data = base64.b64encode(contents).decode('utf-8')
# # # # #         image_data = f"data:image/jpeg;base64,{image_data}"

# # # # #         payload = {"image": image_data}
# # # # #         response_image = await process_image(payload)
# # # # #         response_lip = await process_lip(payload)

# # # # #         # Get color recommendations
# # # # #         color_recommendations = get_color_recommendations(response_image["result"]["result"], response_lip["result"]["result"])

# # # # #         return JSONResponse(content={
# # # # #             "response_image": response_image,
# # # # #             "response_lip": response_lip,
# # # # #             "color_recommendations": color_recommendations
# # # # #         })
# # # # #     except Exception as e:
# # # # #         logger.error(f"Error processing upload_image: {e}")
# # # # #         raise HTTPException(status_code=500, detail="fail")

# # # # # async def process_image(data: dict):
# # # # #     try:
# # # # #         logger.info("Processing image for /image endpoint.")

# # # # #         # Extract and decode the image
# # # # #         image_data = data["image"]
# # # # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # # # #         # Save the decoded image
# # # # #         saved_image_path = "saved.jpg"
# # # # #         with open(saved_image_path, "wb") as fi:
# # # # #             fi.write(decoded_image)
# # # # #         logger.info("Image saved as saved.jpg.")

# # # # #         # Process the saved image to generate a skin mask
# # # # #         f.save_skin_mask(saved_image_path)
# # # # #         logger.info("Skin mask saved as temp.jpg.")
        
# # # # #         # Determine the season from the skin mask
# # # # #         season_image_path = "temp.jpg"
# # # # #         ans = m.get_season(season_image_path)

# # # # #         # Clean up temporary files
# # # # #         os.remove(season_image_path)
# # # # #         os.remove(saved_image_path)

# # # # #         # Adjust the season result according to the mapping
# # # # #         if ans == 3:
# # # # #             ans += 1
# # # # #         elif ans == 0:
# # # # #             ans = 3

# # # # #         # Mapping of the season result to season names
# # # # #         seasons = {1: "spring", 2: "summer", 3: "autumn", 4: "winter"}
# # # # #         season_name = seasons.get(ans, "unknown")
        
# # # # #         result = {'result': ans, 'season': season_name}
# # # # #         logger.info(f"Processed season result: {result}")

# # # # #         return {"message": "complete", "result": result}
# # # # #     except Exception as e:
# # # # #         logger.error(f"Error processing image: {e}")
# # # # #         raise HTTPException(status_code=500, detail="fail")

# # # # # async def process_lip(data: dict):
# # # # #     try:
# # # # #         logger.info("Processing image for /lip endpoint.")
# # # # #         image_data = data["image"]
# # # # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # # # #         with open("saved.jpg", "wb") as fi:
# # # # #             fi.write(decoded_image)
# # # # #         logger.info("Image saved as saved.jpg.")

# # # # #         path = "saved.jpg"
# # # # #         rgb_codes = f.get_rgb_codes(path)
# # # # #         random_rgb_codes = f.filter_lip_random(rgb_codes, 40)

# # # # #         os.remove("saved.jpg")
# # # # #         logger.info("Processed RGB codes and saved random sample.")

# # # # #         types = Counter(f.calc_dis(random_rgb_codes))
# # # # #         max_value_key = max(types, key=types.get)
# # # # #         logger.info(f"Processed lip result: {max_value_key}")

# # # # #         # Map the results to the season names
# # # # #         lip_seasons = {'sp': 'spring', 'su': 'summer', 'au': 'autumn', 'win': 'winter'}
# # # # #         lip_season = lip_seasons.get(max_value_key, 'unknown')

# # # # #         result_data = {'result': lip_season}
# # # # #         return {"message": "complete", "result": result_data}
# # # # #     except Exception as e:
# # # # #         logger.error(f"Error processing lip: {e}")
# # # # #         raise HTTPException(status_code=500, detail="fail")


# # # # # def get_color_recommendations(skin_tone: int, lip_tone: int):
# # # # #     # Mapping skin tones and lip tones to color recommendations
# # # # #     # color_palette = {
# # # # #     #     1: {
# # # # #     #         'spring': ["#FFDDC1", "#FFABAB", "#FFC3A0", "#FF677D"],
# # # # #     #         'summer': ["#E0A899", "#D57A66", "#A26769", "#5D5A5A"],
# # # # #     #         'autumn': ["#B16B8E", "#A676A7", "#64403E", "#F8AFA6"],
# # # # #     #         'winter': ["#E5D8BE", "#8A716A", "#594D45", "#413D3D"]
# # # # #     #     },
# # # # #     #     2: {
# # # # #     #         'spring': ["#FFE4E1", "#FF7F50", "#FF6F61", "#B5651D"],
# # # # #     #         'summer': ["#D6A4A4", "#9C6868", "#6B4B3A", "#3A3A3A"],
# # # # #     #         'autumn': ["#A39391", "#8B5E83", "#63474D", "#3D3035"],
# # # # #     #         'winter': ["#FFF5EE", "#C7ADA3", "#A8907B", "#735A57"]
# # # # #     #     },
# # # # #     #     3: {
# # # # #     #         'spring': ["#FFDAB9", "#E6B0AA", "#D5B9B2", "#B16B8E"],
# # # # #     #         'summer': ["#F5CBA7", "#E59866", "#A569BD", "#5B2C6F"],
# # # # #     #         'autumn': ["#AAB7B8", "#85929E", "#566573", "#2C3E50"],
# # # # #     #         'winter': ["#D5D8DC", "#ABB2B9", "#717D7E", "#4D5656"]
# # # # #     #     },
# # # # #     #     4: {
# # # # #     #         'spring': ["#FFEFDB", "#D7BDE2", "#BB8FCE", "#7D3C98"],
# # # # #     #         'summer': ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#DA70D6"],
# # # # #     #         'autumn': ["#F5EEF8", "#D2B4DE", "#A569BD", "#633974"],
# # # # #     #         'winter': ["#F8F9F9", "#E5E8E8", "#CCD1D1", "#979A9A"]
# # # # #     #     }
# # # # #     # }
# # # # #     color_palette = {
# # # # #     1: {
# # # # #         'spring': ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # # # #         'summer': ["#E0A899", "#FFDAB9", "#F5DEB3", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE", "#FFF8DC", "#FAFAD2", "#FFE4C4"],
# # # # #         'autumn': ["#B16B8E", "#D8BFD8", "#DDA0DD", "#EE82EE", "#DA70D6", "#BA55D3", "#9932CC", "#8A2BE2", "#9400D3", "#8B008B"],
# # # # #         'winter': ["#E5D8BE", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#000000"]
# # # # #     },
# # # # #     2: {
# # # # #         'spring': ["#FFE4E1", "#FFDAB9", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # # # #         'summer': ["#D6A4A4", "#F5DEB3", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE", "#FFF8DC", "#FAFAD2", "#FFE4C4"],
# # # # #         'autumn': ["#A39391", "#8B5E83", "#63474D", "#3D3035", "#A52A2A", "#8B0000", "#B22222", "#CD5C5C", "#DC143C", "#FF0000"],
# # # # #         'winter': ["#FFF5EE", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#000000"]
# # # # #     },
# # # # #     3: {
# # # # #         'spring': ["#FFDAB9", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # # # #         'summer': ["#F5CBA7", "#F5DEB3", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE", "#FFF8DC", "#FAFAD2", "#FFE4C4"],
# # # # #         'autumn': ["#AAB7B8", "#85929E", "#566573", "#2C3E50", "#A52A2A", "#8B0000", "#B22222", "#CD5C5C", "#DC143C", "#FF0000"],
# # # # #         'winter': ["#D5D8DC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#000000"]
# # # # #     },
# # # # #     4: {
# # # # #         'spring': ["#FFEFDB", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # # # #         'summer': ["#E6E6FA", "#F5DEB3", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE", "#FFF8DC", "#FAFAD2", "#FFE4C4"],
# # # # #         'autumn': ["#F5EEF8", "#D2B4DE", "#A569BD", "#633974", "#A52A2A", "#8B0000", "#B22222", "#CD5C5C", "#DC143C", "#FF0000"],
# # # # #         'winter': ["#F8F9F9", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#000000"]
# # # # #         }
# # # # #     }
    
# # # # #     return color_palette.get(skin_tone, {}).get(lip_tone, [])

# # # # # if __name__ == "__main__":
# # # # #     import uvicorn
# # # # #     logger.info("Starting server...")
# # # # #     uvicorn.run(app, host="localhost", port=8000, reload=True)

# # # # import base64
# # # # import os
# # # # import logging
# # # # from fastapi import FastAPI, HTTPException, Request, UploadFile, File
# # # # from fastapi.middleware.cors import CORSMiddleware
# # # # from fastapi.responses import JSONResponse
# # # # from fastapi.templating import Jinja2Templates
# # # # import cv2
# # # # import mediapipe as mp
# # # # import numpy as np
# # # # from ultralytics import YOLO

# # # # # Configure logging
# # # # logging.basicConfig(level=logging.INFO)
# # # # logger = logging.getLogger(__name__)

# # # # app = FastAPI()

# # # # # Allow CORS for frontend communication
# # # # origins = [
# # # #     "http://localhost:3000",  # Your frontend application (if any)
# # # #     "http://localhost:8000"   # Your FastAPI application
# # # # ]

# # # # app.add_middleware(
# # # #     CORSMiddleware,
# # # #     allow_origins=origins,
# # # #     allow_credentials=True,
# # # #     allow_methods=["*"],
# # # #     allow_headers=["*"],
# # # # )

# # # # templates = Jinja2Templates(directory="templates")

# # # # # Load YOLO model for eye color detection
# # # # model_path = 'best.pt'  # Replace with your model path
# # # # eye_color_model = YOLO(model_path)

# # # # @app.get("/", response_class=JSONResponse)
# # # # async def read_root(request: Request):
# # # #     logger.info("Serving root endpoint.")
# # # #     return templates.TemplateResponse("index.html", {"request": request})

# # # # @app.post("/upload_image")
# # # # async def upload_image(file: UploadFile = File(...)):
# # # #     try:
# # # #         logger.info("Received image upload request.")
# # # #         contents = await file.read()
# # # #         image_data = base64.b64encode(contents).decode('utf-8')
# # # #         image_data = f"data:image/jpeg;base64,{image_data}"

# # # #         payload = {"image": image_data}
# # # #         response_image = await process_image(payload)
# # # #         response_eye = await process_eye(payload)

# # # #         # Get color recommendations
# # # #         color_recommendations = get_color_recommendations(response_image["result"]["result"], response_eye["result"]["result"])

# # # #         return JSONResponse(content={
# # # #             "response_image": response_image,
# # # #             "response_eye": response_eye,
# # # #             "color_recommendations": color_recommendations
# # # #         })
# # # #     except Exception as e:
# # # #         logger.error(f"Error processing upload_image: {e}")
# # # #         raise HTTPException(status_code=500, detail="fail")

# # # # async def process_image(data: dict):
# # # #     try:
# # # #         logger.info("Processing image for /image endpoint.")

# # # #         # Extract and decode the image
# # # #         image_data = data["image"]
# # # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # # #         # Save the decoded image
# # # #         saved_image_path = "saved.jpg"
# # # #         with open(saved_image_path, "wb") as fi:
# # # #             fi.write(decoded_image)
# # # #         logger.info("Image saved as saved.jpg.")

# # # #         # Process the saved image to generate a skin tone (replace with actual logic)
# # # #         skin_tone = 2  # Replace with actual skin tone detection logic
# # # #         result = {'result': skin_tone}
# # # #         logger.info(f"Processed skin tone result: {result}")

# # # #         # Clean up temporary files
# # # #         os.remove(saved_image_path)

# # # #         return {"message": "complete", "result": result}
# # # #     except Exception as e:
# # # #         logger.error(f"Error processing image: {e}")
# # # #         raise HTTPException(status_code=500, detail="fail")

# # # # async def process_eye(data: dict):
# # # #     try:
# # # #         logger.info("Processing image for /eye endpoint.")
# # # #         image_data = data["image"]
# # # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # # #         with open("saved.jpg", "wb") as fi:
# # # #             fi.write(decoded_image)
# # # #         logger.info("Image saved as saved.jpg.")

# # # #         # Read the image
# # # #         image = cv2.imread("saved.jpg")
# # # #         if image is None:
# # # #             raise HTTPException(status_code=500, detail="Error loading image")

# # # #         # Extract and enhance the eye image
# # # #         eye_result = extract_single_eye(image, left_eye=True)
# # # #         if eye_result is None:
# # # #             raise HTTPException(status_code=500, detail="No eye detected")

# # # #         eye_image, bbox = eye_result
# # # #         enhanced_eye = enhance_eye_image(eye_image)

# # # #         # Predict eye color
# # # #         color_class, confidence = predict_eye_color(eye_color_model, enhanced_eye)
# # # #         if color_class is None:
# # # #             raise HTTPException(status_code=500, detail="No eye color predicted")

# # # #         # Clean up temporary files
# # # #         os.remove("saved.jpg")

# # # #         result_data = {'result': color_class}
# # # #         return {"message": "complete", "result": result_data}
# # # #     except Exception as e:
# # # #         logger.error(f"Error processing eye: {e}")
# # # #         raise HTTPException(status_code=500, detail="fail")

# # # # def extract_single_eye(image, left_eye=True):
# # # #     """
# # # #     Extract single eye from a face image using MediaPipe.
# # # #     """
# # # #     # Initialize MediaPipe Face Mesh
# # # #     mp_face_mesh = mp.solutions.face_mesh
# # # #     face_mesh = mp_face_mesh.FaceMesh(
# # # #         static_image_mode=True,
# # # #         max_num_faces=1,
# # # #         refine_landmarks=True,
# # # #         min_detection_confidence=0.5
# # # #     )

# # # #     # Convert to RGB (MediaPipe requires RGB input)
# # # #     if len(image.shape) == 2:  # If grayscale
# # # #         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
# # # #     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# # # #     height, width = image.shape[:2]
    
# # # #     # Detect facial landmarks
# # # #     results = face_mesh.process(image_rgb)
    
# # # #     if not results.multi_face_landmarks:
# # # #         print("No face detected!")
# # # #         return None
    
# # # #     landmarks = results.multi_face_landmarks[0].landmark
    
# # # #     # Define eye landmarks indices
# # # #     if left_eye:
# # # #         # Left eye landmarks
# # # #         eye_indices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
# # # #     else:
# # # #         # Right eye landmarks
# # # #         eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    
# # # #     # Get eye coordinates
# # # #     eye_coords = np.array([(int(landmarks[idx].x * width), int(landmarks[idx].y * height)) 
# # # #                           for idx in eye_indices])
    
# # # #     # Calculate bounding box with padding
# # # #     x_min, y_min = np.min(eye_coords, axis=0)
# # # #     x_max, y_max = np.max(eye_coords, axis=0)
    
# # # #     # Add padding (30% of eye size)
# # # #     eye_width = x_max - x_min
# # # #     eye_height = y_max - y_min
# # # #     padding_x = int(eye_width * 0.3)
# # # #     padding_y = int(eye_height * 0.3)
    
# # # #     # Ensure padded coordinates are within image bounds
# # # #     x_min = max(0, x_min - padding_x)
# # # #     y_min = max(0, y_min - padding_y)
# # # #     x_max = min(width, x_max + padding_x)
# # # #     y_max = min(height, y_max + padding_y)
    
# # # #     # Crop eye region
# # # #     eye_image = image[y_min:y_max, x_min:x_max]
    
# # # #     # Release resources
# # # #     face_mesh.close()
    
# # # #     return eye_image, (x_min, y_min, x_max, y_max)

# # # # def enhance_eye_image(eye_image):
# # # #     """
# # # #     Enhance the extracted eye image quality.
# # # #     """
# # # #     # Resize to ensure minimum size
# # # #     min_size = 224
# # # #     h, w = eye_image.shape[:2]
# # # #     if h < min_size or w < min_size:
# # # #         scale = min_size / min(h, w)
# # # #         eye_image = cv2.resize(eye_image, (int(w * scale), int(h * scale)), 
# # # #                              interpolation=cv2.INTER_LANCZOS4)
    
# # # #     # Convert to LAB color space
# # # #     lab = cv2.cvtColor(eye_image, cv2.COLOR_BGR2LAB)
# # # #     l, a, b = cv2.split(lab)
    
# # # #     # Apply CLAHE
# # # #     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
# # # #     cl = clahe.apply(l)
    
# # # #     # Merge channels
# # # #     enhanced_lab = cv2.merge((cl, a, b))
# # # #     enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
# # # #     # Denoise
# # # #     enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
# # # #     return enhanced_bgr

# # # # def predict_eye_color(model, eye_image):
# # # #     """
# # # #     Predict eye color using the YOLO model.
# # # #     """
# # # #     results = model(eye_image)[0]
    
# # # #     # Get the prediction with highest confidence
# # # #     if len(results.boxes) > 0:
# # # #         # Get confidence scores and class indices
# # # #         confidences = results.boxes.conf
# # # #         class_indices = results.boxes.cls
        
# # # #         # Get index of highest confidence
# # # #         max_conf_idx = confidences.argmax()
        
# # # #         # Get class name and confidence
# # # #         class_idx = int(class_indices[max_conf_idx])
# # # #         confidence = float(confidences[max_conf_idx])
# # # #         class_name = results.names[class_idx]
        
# # # #         return class_name, confidence
    
# # # #     return None, None

# # # # def get_color_recommendations(skin_tone: int, eye_color: str):
# # # #     """
# # # #     Get color recommendations based on skin tone and eye color.
# # # #     Skin tone maps to a season (spring, summer, autumn, winter).
# # # #     Eye color refines the color palette within the season.
# # # #     """
# # # #     # Map skin tone to a season
# # # #     season_mapping = {
# # # #         1: "spring",
# # # #         2: "summer",
# # # #         3: "autumn",
# # # #         4: "winter"
# # # #     }

# # # #     # Determine the season based on skin tone
# # # #     season = season_mapping.get(skin_tone, "unknown")

# # # #     # Provide color recommendations based on the season and eye color
# # # #     seasonal_colors = {
# # # #         "spring": {
# # # #             "Amber": ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # # #             "Blue": ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# # # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # # #             "Green": ["#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98"],
# # # #             "Grey": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#A9A9A9"],
# # # #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# # # #         },
# # # #         "summer": {
# # # #             "Amber": ["#FFA07A", "#FF8C69", "#FF7F50", "#FF6347", "#FF4500", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # # #             "Blue": ["#6495ED", "#4682B4", "#5F9EA0", "#00CED1", "#40E0D0", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0"],
# # # #             "Brown": ["#A0522D", "#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # # #             "Green": ["#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371"],
# # # #             "Grey": ["#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# # # #             "Hazel": ["#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C"]
# # # #         },
# # # #         "autumn": {
# # # #             "Amber": ["#FF7F50", "#FF6347", "#FF4500", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # # #             "Blue": ["#4169E1", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3"],
# # # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # # #             "Green": ["#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# # # #             "Grey": ["#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969"],
# # # #             "Hazel": ["#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD"]
# # # #         },
# # # #         "winter": {
# # # #             "Amber": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # # #             "Blue": ["#00008B", "#0000CD", "#1E90FF", "#4169E1", "#6495ED", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
# # # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # # #             "Green": ["#228B22", "#2E8B57", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# # # #             "Grey": ["#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899"],
# # # #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# # # #         }
# # # #     }

# # # #     # Get the color recommendations for the season and eye color
# # # #     return seasonal_colors.get(season, {}).get(eye_color, [])

# # # # if __name__ == "__main__":
# # # #     import uvicorn
# # # #     logger.info("Starting server...")
# # # #     uvicorn.run(app, host="localhost", port=8000, reload=True)
# # # import base64
# # # import os
# # # import logging
# # # from fastapi import FastAPI, HTTPException, Request, UploadFile, File
# # # from fastapi.middleware.cors import CORSMiddleware
# # # from fastapi.responses import JSONResponse
# # # from fastapi.templating import Jinja2Templates
# # # import cv2
# # # import mediapipe as mp
# # # import numpy as np
# # # from ultralytics import YOLO

# # # # Configure logging
# # # logging.basicConfig(level=logging.INFO)
# # # logger = logging.getLogger(__name__)

# # # app = FastAPI()

# # # # Allow CORS for frontend communication
# # # origins = [
# # #     "http://localhost:3000",  # Your frontend application (if any)
# # #     "http://localhost:8000"   # Your FastAPI application
# # # ]

# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=origins,
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )

# # # templates = Jinja2Templates(directory="templates")

# # # # Load YOLO model for eye color detection
# # # model_path = 'best.pt'  # Replace with your model path
# # # eye_color_model = YOLO(model_path)

# # # @app.get("/", response_class=JSONResponse)
# # # async def read_root(request: Request):
# # #     logger.info("Serving root endpoint.")
# # #     return templates.TemplateResponse("index.html", {"request": request})

# # # @app.post("/upload_image")
# # # async def upload_image(file: UploadFile = File(...)):
# # #     try:
# # #         logger.info("Received image upload request.")
# # #         contents = await file.read()
# # #         image_data = base64.b64encode(contents).decode('utf-8')
# # #         image_data = f"data:image/jpeg;base64,{image_data}"

# # #         payload = {"image": image_data}
# # #         response_image = await process_image(payload)
# # #         response_eye = await process_eye(payload)

# # #         # Get color recommendations
# # #         color_recommendations = get_color_recommendations(response_image["result"]["result"], response_eye["result"]["result"])

# # #         return JSONResponse(content={
# # #             "response_image": response_image,
# # #             "response_eye": response_eye,
# # #             "color_recommendations": color_recommendations
# # #         })
# # #     except Exception as e:
# # #         logger.error(f"Error processing upload_image: {e}")
# # #         raise HTTPException(status_code=500, detail="fail")

# # # async def process_image(data: dict):
# # #     try:
# # #         logger.info("Processing image for /image endpoint.")

# # #         # Extract and decode the image
# # #         image_data = data["image"]
# # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # #         # Save the decoded image
# # #         saved_image_path = "saved.jpg"
# # #         with open(saved_image_path, "wb") as fi:
# # #             fi.write(decoded_image)
# # #         logger.info("Image saved as saved.jpg.")

# # #         # Process the saved image to generate a skin tone (replace with actual logic)
# # #         skin_tone = 2  # Replace with actual skin tone detection logic
# # #         result = {'result': skin_tone}
# # #         logger.info(f"Processed skin tone result: {result}")

# # #         # Clean up temporary files
# # #         os.remove(saved_image_path)

# # #         return {"message": "complete", "result": result}
# # #     except Exception as e:
# # #         logger.error(f"Error processing image: {e}")
# # #         raise HTTPException(status_code=500, detail="fail")

# # # async def process_eye(data: dict):
# # #     try:
# # #         logger.info("Processing image for /eye endpoint.")
# # #         image_data = data["image"]
# # #         decoded_image = base64.b64decode(image_data.split(",")[1])

# # #         with open("saved.jpg", "wb") as fi:
# # #             fi.write(decoded_image)
# # #         logger.info("Image saved as saved.jpg.")

# # #         # Read the image
# # #         image = cv2.imread("saved.jpg")
# # #         if image is None:
# # #             logger.error("Error loading image.")
# # #             raise HTTPException(status_code=500, detail="Error loading image")

# # #         # Resize the image to a consistent size
# # #         image = cv2.resize(image, (640, 640))  # Resize to 640x640 for consistency

# # #         # Extract and enhance the eye image
# # #         eye_result = extract_single_eye(image, left_eye=True)
# # #         if eye_result is None:
# # #             logger.error("No eye detected.")
# # #             raise HTTPException(status_code=400, detail="No eye detected")

# # #         eye_image, bbox = eye_result
# # #         enhanced_eye = enhance_eye_image(eye_image)

# # #         # Predict eye color
# # #         color_class, confidence = predict_eye_color(eye_color_model, enhanced_eye)
# # #         if color_class is None:
# # #             logger.error("No eye color predicted.")
# # #             raise HTTPException(status_code=400, detail="No eye color predicted")

# # #         # Clean up temporary files
# # #         os.remove("saved.jpg")

# # #         result_data = {'result': color_class}
# # #         return {"message": "complete", "result": result_data}
# # #     except Exception as e:
# # #         logger.error(f"Error processing eye: {e}")
# # #         raise HTTPException(status_code=500, detail="fail")

# # # def extract_single_eye(image, left_eye=True):
# # #     """
# # #     Extract single eye from a face image using MediaPipe.
# # #     """
# # #     # Initialize MediaPipe Face Mesh
# # #     mp_face_mesh = mp.solutions.face_mesh
# # #     face_mesh = mp_face_mesh.FaceMesh(
# # #         static_image_mode=True,
# # #         max_num_faces=1,
# # #         refine_landmarks=True,
# # #         min_detection_confidence=0.5
# # #     )

# # #     # Convert to RGB (MediaPipe requires RGB input)
# # #     if len(image.shape) == 2:  # If grayscale
# # #         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
# # #     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# # #     height, width = image.shape[:2]
    
# # #     # Detect facial landmarks
# # #     results = face_mesh.process(image_rgb)
    
# # #     if not results.multi_face_landmarks:
# # #         logger.warning("No face detected!")
# # #         return None
    
# # #     landmarks = results.multi_face_landmarks[0].landmark
    
# # #     # Define eye landmarks indices
# # #     if left_eye:
# # #         # Left eye landmarks
# # #         eye_indices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
# # #     else:
# # #         # Right eye landmarks
# # #         eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    
# # #     # Get eye coordinates
# # #     eye_coords = np.array([(int(landmarks[idx].x * width), int(landmarks[idx].y * height)) 
# # #                           for idx in eye_indices])
    
# # #     # Calculate bounding box with padding
# # #     x_min, y_min = np.min(eye_coords, axis=0)
# # #     x_max, y_max = np.max(eye_coords, axis=0)
    
# # #     # Add padding (30% of eye size)
# # #     eye_width = x_max - x_min
# # #     eye_height = y_max - y_min
# # #     padding_x = int(eye_width * 0.3)
# # #     padding_y = int(eye_height * 0.3)
    
# # #     # Ensure padded coordinates are within image bounds
# # #     x_min = max(0, x_min - padding_x)
# # #     y_min = max(0, y_min - padding_y)
# # #     x_max = min(width, x_max + padding_x)
# # #     y_max = min(height, y_max + padding_y)
    
# # #     # Crop eye region
# # #     eye_image = image[y_min:y_max, x_min:x_max]
    
# # #     # Release resources
# # #     face_mesh.close()
    
# # #     return eye_image, (x_min, y_min, x_max, y_max)

# # # def enhance_eye_image(eye_image):
# # #     """
# # #     Enhance the extracted eye image quality.
# # #     """
# # #     # Resize to ensure minimum size
# # #     min_size = 224
# # #     h, w = eye_image.shape[:2]
# # #     if h < min_size or w < min_size:
# # #         scale = min_size / min(h, w)
# # #         eye_image = cv2.resize(eye_image, (int(w * scale), int(h * scale)), 
# # #                              interpolation=cv2.INTER_LANCZOS4)
    
# # #     # Convert to LAB color space
# # #     lab = cv2.cvtColor(eye_image, cv2.COLOR_BGR2LAB)
# # #     l, a, b = cv2.split(lab)
    
# # #     # Apply CLAHE
# # #     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
# # #     cl = clahe.apply(l)
    
# # #     # Merge channels
# # #     enhanced_lab = cv2.merge((cl, a, b))
# # #     enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
# # #     # Denoise
# # #     enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
# # #     return enhanced_bgr

# # # def predict_eye_color(model, eye_image):
# # #     """
# # #     Predict eye color using the YOLO model.
# # #     """
# # #     results = model(eye_image)[0]
    
# # #     # Get the prediction with highest confidence
# # #     if len(results.boxes) > 0:
# # #         # Get confidence scores and class indices
# # #         confidences = results.boxes.conf
# # #         class_indices = results.boxes.cls
        
# # #         # Get index of highest confidence
# # #         max_conf_idx = confidences.argmax()
        
# # #         # Get class name and confidence
# # #         class_idx = int(class_indices[max_conf_idx])
# # #         confidence = float(confidences[max_conf_idx])
# # #         class_name = results.names[class_idx]
        
# # #         logger.info(f"Predicted eye color: {class_name} with confidence {confidence:.2f}")
# # #         return class_name, confidence
    
# # #     logger.warning("No eye color predicted.")
# # #     return None, None

# # # def get_color_recommendations(skin_tone: int, eye_color: str):
# # #     """
# # #     Get color recommendations based on skin tone and eye color.
# # #     Skin tone maps to a season (spring, summer, autumn, winter).
# # #     Eye color refines the color palette within the season.
# # #     """
# # #     # Map skin tone to a season
# # #     season_mapping = {
# # #         1: "spring",
# # #         2: "summer",
# # #         3: "autumn",
# # #         4: "winter"
# # #     }

# # #     # Determine the season based on skin tone
# # #     season = season_mapping.get(skin_tone, "unknown")

# # #     # Provide color recommendations based on the season and eye color
# # #     seasonal_colors = {
# # #         "spring": {
# # #             "Amber": ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# # #             "Blue": ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # #             "Green": ["#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98"],
# # #             "Grey": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#A9A9A9"],
# # #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# # #         },
# # #         "summer": {
# # #             "Amber": ["#FFA07A", "#FF8C69", "#FF7F50", "#FF6347", "#FF4500", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # #             "Blue": ["#6495ED", "#4682B4", "#5F9EA0", "#00CED1", "#40E0D0", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0"],
# # #             "Brown": ["#A0522D", "#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # #             "Green": ["#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371"],
# # #             "Grey": ["#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# # #             "Hazel": ["#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C"]
# # #         },
# # #         "autumn": {
# # #             "Amber": ["#FF7F50", "#FF6347", "#FF4500", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # #             "Blue": ["#4169E1", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3"],
# # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # #             "Green": ["#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# # #             "Grey": ["#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969"],
# # #             "Hazel": ["#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD"]
# # #         },
# # #         "winter": {
# # #             "Amber": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# # #             "Blue": ["#00008B", "#0000CD", "#1E90FF", "#4169E1", "#6495ED", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
# # #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# # #             "Green": ["#228B22", "#2E8B57", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# # #             "Grey": ["#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899"],
# # #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# # #         }
# # #     }

# # #     # Get the color recommendations for the season and eye color
# # #     return seasonal_colors.get(season, {}).get(eye_color, [])

# # # if __name__ == "__main__":
# # #     import uvicorn
# # #     logger.info("Starting server...")
# # #     uvicorn.run(app, host="localhost", port=8000, reload=True)


# # from fastapi import FastAPI, HTTPException, Request, UploadFile, File
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import JSONResponse
# # from fastapi.templating import Jinja2Templates
# # import cv2
# # import mediapipe as mp
# # import numpy as np
# # from ultralytics import YOLO
# # import base64
# # import os
# # import logging
# # from collections import Counter

# # import functions as f
# # import skin_model as m

# # # Configure logging
# # logging.basicConfig(level=logging.INFO)
# # logger = logging.getLogger(__name__)

# # app = FastAPI()

# # # Allow CORS for frontend communication
# # origins = [
# #     "http://localhost:3000",  # Your frontend application (if any)
# #     "http://localhost:8000"   # Your FastAPI application
# # ]

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # templates = Jinja2Templates(directory="templates")

# # # Load YOLO model for eye color detection
# # model_path = 'best.pt'  # Replace with your model path
# # eye_color_model = YOLO(model_path)

# # @app.get("/", response_class=JSONResponse)
# # async def read_root(request: Request):
# #     logger.info("Serving root endpoint.")
# #     return templates.TemplateResponse("index.html", {"request": request})

# # @app.post("/upload_image")
# # async def upload_image(file: UploadFile = File(...)):
# #     try:
# #         logger.info("Received image upload request.")
# #         contents = await file.read()
# #         image_data = base64.b64encode(contents).decode('utf-8')
# #         image_data = f"data:image/jpeg;base64,{image_data}"

# #         payload = {"image": image_data}
        
# #         # Process skin tone
# #         response_skin = await process_skin(payload)
        
# #         # Process eye color
# #         response_eye = await process_eye(payload)
        
# #         # Process lip color from original code if needed
# #         # response_lip = await process_lip(payload)

# #         # Get color recommendations based on skin tone and eye color
# #         color_recommendations = get_color_recommendations(
# #             response_skin["result"]["result"], 
# #             response_eye["result"]["result"]
# #         )

# #         return JSONResponse(content={
# #             "response_skin": response_skin,
# #             "response_eye": response_eye,
# #             "color_recommendations": color_recommendations
# #         })
# #     except Exception as e:
# #         logger.error(f"Error processing upload_image: {e}")
# #         raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# # async def process_skin(data: dict):
# #     try:
# #         logger.info("Processing image for skin tone analysis.")

# #         # Extract and decode the image
# #         image_data = data["image"]
# #         decoded_image = base64.b64decode(image_data.split(",")[1])

# #         # Save the decoded image
# #         saved_image_path = "saved.jpg"
# #         with open(saved_image_path, "wb") as fi:
# #             fi.write(decoded_image)
# #         logger.info("Image saved as saved.jpg.")

# #         # Process the saved image to generate a skin mask
# #         f.save_skin_mask(saved_image_path)
# #         logger.info("Skin mask saved as temp.jpg.")
        
# #         # Determine the season from the skin mask
# #         season_image_path = "temp.jpg"
# #         ans = m.get_season(season_image_path)

# #         # Clean up temporary files
# #         os.remove(season_image_path)
# #         os.remove(saved_image_path)

# #         # Adjust the season result according to the mapping
# #         if ans == 3:
# #             ans += 1
# #         elif ans == 0:
# #             ans = 3

# #         # Mapping of the season result to season names
# #         seasons = {1: "spring", 2: "summer", 3: "autumn", 4: "winter"}
# #         season_name = seasons.get(ans, "unknown")
        
# #         result = {'result': ans, 'season': season_name}
# #         logger.info(f"Processed skin tone result: {result}")

# #         return {"message": "complete", "result": result}
# #     except Exception as e:
# #         logger.error(f"Error processing skin: {e}")
# #         raise HTTPException(status_code=500, detail=f"Skin analysis failed: {str(e)}")

# # async def process_eye(data: dict):
# #     try:
# #         logger.info("Processing image for eye color analysis.")
# #         image_data = data["image"]
# #         decoded_image = base64.b64decode(image_data.split(",")[1])

# #         with open("saved.jpg", "wb") as fi:
# #             fi.write(decoded_image)
# #         logger.info("Image saved as saved.jpg.")

# #         # Read the image
# #         image = cv2.imread("saved.jpg")
# #         if image is None:
# #             logger.error("Error loading image.")
# #             raise HTTPException(status_code=500, detail="Error loading image")

# #         # Resize the image to a consistent size
# #         image = cv2.resize(image, (640, 640))  # Resize to 640x640 for consistency

# #         # Extract and enhance the eye image
# #         eye_result = extract_single_eye(image, left_eye=True)
# #         if eye_result is None:
# #             logger.error("No eye detected.")
# #             raise HTTPException(status_code=400, detail="No eye detected")

# #         eye_image, bbox = eye_result
# #         enhanced_eye = enhance_eye_image(eye_image)

# #         # Predict eye color
# #         color_class, confidence = predict_eye_color(eye_color_model, enhanced_eye)
# #         if color_class is None:
# #             logger.error("No eye color predicted.")
# #             raise HTTPException(status_code=400, detail="No eye color predicted")

# #         # Clean up temporary files
# #         os.remove("saved.jpg")

# #         result_data = {'result': color_class}
# #         return {"message": "complete", "result": result_data}
# #     except Exception as e:
# #         logger.error(f"Error processing eye: {e}")
# #         raise HTTPException(status_code=500, detail=f"Eye analysis failed: {str(e)}")

# # async def process_lip(data: dict):
# #     try:
# #         logger.info("Processing image for lip color analysis.")
# #         image_data = data["image"]
# #         decoded_image = base64.b64decode(image_data.split(",")[1])

# #         with open("saved.jpg", "wb") as fi:
# #             fi.write(decoded_image)
# #         logger.info("Image saved as saved.jpg.")

# #         path = "saved.jpg"
# #         rgb_codes = f.get_rgb_codes(path)
# #         random_rgb_codes = f.filter_lip_random(rgb_codes, 40)

# #         os.remove("saved.jpg")
# #         logger.info("Processed RGB codes and saved random sample.")

# #         types = Counter(f.calc_dis(random_rgb_codes))
# #         max_value_key = max(types, key=types.get)
# #         logger.info(f"Processed lip result: {max_value_key}")

# #         # Map the results to the season names
# #         lip_seasons = {'sp': 'spring', 'su': 'summer', 'au': 'autumn', 'win': 'winter'}
# #         lip_season = lip_seasons.get(max_value_key, 'unknown')

# #         result_data = {'result': lip_season}
# #         return {"message": "complete", "result": result_data}
# #     except Exception as e:
# #         logger.error(f"Error processing lip: {e}")
# #         raise HTTPException(status_code=500, detail=f"Lip analysis failed: {str(e)}")

# # def extract_single_eye(image, left_eye=True):
# #     """
# #     Extract single eye from a face image using MediaPipe.
# #     """
# #     # Initialize MediaPipe Face Mesh
# #     mp_face_mesh = mp.solutions.face_mesh
# #     face_mesh = mp_face_mesh.FaceMesh(
# #         static_image_mode=True,
# #         max_num_faces=1,
# #         refine_landmarks=True,
# #         min_detection_confidence=0.5
# #     )

# #     # Convert to RGB (MediaPipe requires RGB input)
# #     if len(image.shape) == 2:  # If grayscale
# #         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
# #     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# #     height, width = image.shape[:2]
    
# #     # Detect facial landmarks
# #     results = face_mesh.process(image_rgb)
    
# #     if not results.multi_face_landmarks:
# #         logger.warning("No face detected!")
# #         return None
    
# #     landmarks = results.multi_face_landmarks[0].landmark
    
# #     # Define eye landmarks indices
# #     if left_eye:
# #         # Left eye landmarks
# #         eye_indices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
# #     else:
# #         # Right eye landmarks
# #         eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    
# #     # Get eye coordinates
# #     eye_coords = np.array([(int(landmarks[idx].x * width), int(landmarks[idx].y * height)) 
# #                           for idx in eye_indices])
    
# #     # Calculate bounding box with padding
# #     x_min, y_min = np.min(eye_coords, axis=0)
# #     x_max, y_max = np.max(eye_coords, axis=0)
    
# #     # Add padding (30% of eye size)
# #     eye_width = x_max - x_min
# #     eye_height = y_max - y_min
# #     padding_x = int(eye_width * 0.3)
# #     padding_y = int(eye_height * 0.3)
    
# #     # Ensure padded coordinates are within image bounds
# #     x_min = max(0, x_min - padding_x)
# #     y_min = max(0, y_min - padding_y)
# #     x_max = min(width, x_max + padding_x)
# #     y_max = min(height, y_max + padding_y)
    
# #     # Crop eye region
# #     eye_image = image[y_min:y_max, x_min:x_max]
    
# #     # Release resources
# #     face_mesh.close()
    
# #     return eye_image, (x_min, y_min, x_max, y_max)

# # def enhance_eye_image(eye_image):
# #     """
# #     Enhance the extracted eye image quality.
# #     """
# #     # Resize to ensure minimum size
# #     min_size = 224
# #     h, w = eye_image.shape[:2]
# #     if h < min_size or w < min_size:
# #         scale = min_size / min(h, w)
# #         eye_image = cv2.resize(eye_image, (int(w * scale), int(h * scale)), 
# #                              interpolation=cv2.INTER_LANCZOS4)
    
# #     # Convert to LAB color space
# #     lab = cv2.cvtColor(eye_image, cv2.COLOR_BGR2LAB)
# #     l, a, b = cv2.split(lab)
    
# #     # Apply CLAHE
# #     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
# #     cl = clahe.apply(l)
    
# #     # Merge channels
# #     enhanced_lab = cv2.merge((cl, a, b))
# #     enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
# #     # Denoise
# #     enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
# #     return enhanced_bgr

# # def predict_eye_color(model, eye_image):
# #     """
# #     Predict eye color using the YOLO model.
# #     """
# #     results = model(eye_image)[0]
    
# #     # Get the prediction with highest confidence
# #     if len(results.boxes) > 0:
# #         # Get confidence scores and class indices
# #         confidences = results.boxes.conf
# #         class_indices = results.boxes.cls
        
# #         # Get index of highest confidence
# #         max_conf_idx = confidences.argmax()
        
# #         # Get class name and confidence
# #         class_idx = int(class_indices[max_conf_idx])
# #         confidence = float(confidences[max_conf_idx])
# #         class_name = results.names[class_idx]
        
# #         logger.info(f"Predicted eye color: {class_name} with confidence {confidence:.2f}")
# #         return class_name, confidence
    
# #     logger.warning("No eye color predicted.")
# #     return None, None

# # def get_color_recommendations(skin_tone: int, eye_color: str):
# #     """
# #     Get color recommendations based on skin tone and eye color.
# #     Skin tone maps to a season (spring, summer, autumn, winter).
# #     Eye color refines the color palette within the season.
# #     """
# #     # Map skin tone to a season
# #     season_mapping = {
# #         1: "spring",
# #         2: "summer",
# #         3: "autumn",
# #         4: "winter"
# #     }

# #     # Determine the season based on skin tone
# #     season = season_mapping.get(skin_tone, "unknown")

# #     # Provide color recommendations based on the season and eye color
# #     seasonal_colors = {
# #         "spring": {
# #             "Amber": ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
# #             "Blue": ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# #             "Green": ["#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98"],
# #             "Grey": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#A9A9A9"],
# #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# #         },
# #         "summer": {
# #             "Amber": ["#FFA07A", "#FF8C69", "#FF7F50", "#FF6347", "#FF4500", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# #             "Blue": ["#6495ED", "#4682B4", "#5F9EA0", "#00CED1", "#40E0D0", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0"],
# #             "Brown": ["#A0522D", "#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# #             "Green": ["#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371"],
# #             "Grey": ["#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
# #             "Hazel": ["#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C"]
# #         },
# #         "autumn": {
# #             "Amber": ["#FF7F50", "#FF6347", "#FF4500", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# #             "Blue": ["#4169E1", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3"],
# #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# #             "Green": ["#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# #             "Grey": ["#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969"],
# #             "Hazel": ["#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD"]
# #         },
# #         "winter": {
# #             "Amber": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
# #             "Blue": ["#00008B", "#0000CD", "#1E90FF", "#4169E1", "#6495ED", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
# #             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
# #             "Green": ["#228B22", "#2E8B57", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
# #             "Grey": ["#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899"],
# #             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
# #         }
# #     }

# #     # Get the color recommendations for the season and eye color
# #     return seasonal_colors.get(season, {}).get(eye_color, [])

# # if __name__ == "__main__":
# #     import uvicorn
# #     logger.info("Starting server...")
# #     uvicorn.run(app, host="localhost", port=8000, reload=True)

# import base64
# import os
# import logging
# from collections import Counter
# from fastapi import FastAPI, HTTPException, Request, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from fastapi.templating import Jinja2Templates
# import cv2
# import mediapipe as mp
# import numpy as np
# from ultralytics import YOLO

# # Import your existing modules
# import functions as f
# import skin_model as m

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI()

# # Allow CORS for frontend communication
# origins = [
#     "http://localhost:3000",  # Your frontend application (if any)
#     "http://localhost:8000"   # Your FastAPI application
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# templates = Jinja2Templates(directory="templates")

# # Load YOLO model for eye color detection
# model_path = 'best.pt'  # Replace with your model path
# eye_color_model = YOLO(model_path)

# @app.get("/", response_class=JSONResponse)
# async def read_root(request: Request):
#     logger.info("Serving root endpoint.")
#     return templates.TemplateResponse("index.html", {"request": request})

# @app.post("/upload_image")
# async def upload_image(file: UploadFile = File(...)):
#     try:
#         logger.info("Received image upload request.")
#         contents = await file.read()
#         image_data = base64.b64encode(contents).decode('utf-8')
#         image_data = f"data:image/jpeg;base64,{image_data}"

#         payload = {"image": image_data}
        
#         # Process skin tone
#         response_skin = await process_skin(payload)
#         logger.info(f"Skin tone processing complete: {response_skin}")
        
#         # Process eye color
#         response_eye = await process_eye(payload)
#         logger.info(f"Eye color processing complete: {response_eye}")
        
#         # Process lip color from original code if needed
#         # response_lip = await process_lip(payload)

#         # Get color recommendations based on skin tone and eye color
#         color_recommendations = get_color_recommendations(
#             response_skin["result"]["result"], 
#             response_eye["result"]["result"]
#         )
#         logger.info(f"Generated {len(color_recommendations)} color recommendations")

#         # Process completed successfully
#         return JSONResponse(content={
#             "response_skin": response_skin,
#             "response_eye": response_eye,
#             "color_recommendations": color_recommendations
#         })
#     except Exception as e:
#         logger.error(f"Error processing upload_image: {e}")
#         logger.error(f"Exception details: {str(e)}")
#         import traceback
#         logger.error(traceback.format_exc())
        
#         # Return a graceful error response with default values
#         default_response = {
#             "response_skin": {"message": "error", "result": {"result": 3, "season": "autumn"}},
#             "response_eye": {"message": "error", "result": {"result": "Brown"}},
#             "color_recommendations": get_color_recommendations(3, "Brown"),
#             "error": str(e)
#         }
#         return JSONResponse(
#             status_code=200,  # Return 200 even on error for graceful frontend handling
#             content=default_response
#         )

# async def process_skin(data: dict):
#     try:
#         logger.info("Processing image for skin tone analysis.")

#         # Extract and decode the image
#         image_data = data["image"]
#         decoded_image = base64.b64decode(image_data.split(",")[1])

#         # Save the decoded image
#         saved_image_path = "saved.jpg"
#         with open(saved_image_path, "wb") as fi:
#             fi.write(decoded_image)
#         logger.info("Image saved as saved.jpg.")

#         # Process the saved image to generate a skin mask
#         f.save_skin_mask(saved_image_path)
#         logger.info("Skin mask saved as temp.jpg.")
        
#         # Determine the season from the skin mask
#         season_image_path = "temp.jpg"
#         ans = m.get_season(season_image_path)

#         # Clean up temporary files
#         os.remove(season_image_path)
#         os.remove(saved_image_path)

#         # Adjust the season result according to the mapping
#         if ans == 3:
#             ans += 1
#         elif ans == 0:
#             ans = 3

#         # Mapping of the season result to season names
#         seasons = {1: "spring", 2: "summer", 3: "autumn", 4: "winter"}
#         season_name = seasons.get(ans, "unknown")
        
#         result = {'result': ans, 'season': season_name}
#         logger.info(f"Processed skin tone result: {result}")

#         return {"message": "complete", "result": result}
#     except Exception as e:
#         logger.error(f"Error processing skin: {e}")
#         raise HTTPException(status_code=500, detail=f"Skin analysis failed: {str(e)}")

# async def process_eye(data: dict):
#     try:
#         logger.info("Processing image for eye color analysis.")
#         image_data = data["image"]
#         decoded_image = base64.b64decode(image_data.split(",")[1])

#         # Save the decoded image
#         saved_image_path = "saved_eye.jpg"
#         with open(saved_image_path, "wb") as fi:
#             fi.write(decoded_image)
#         logger.info(f"Image saved as {saved_image_path}.")

#         # Read the image
#         image = cv2.imread(saved_image_path)
#         if image is None:
#             logger.error("Error loading image.")
#             raise HTTPException(status_code=500, detail="Error loading image")

#         # Save original dimensions for debugging
#         original_height, original_width = image.shape[:2]
#         logger.info(f"Original image dimensions: {original_width}x{original_height}")

#         # Try both eyes in case one fails
#         eye_result = None
#         for try_left_eye in [True, False]:
#             logger.info(f"Attempting to extract {'left' if try_left_eye else 'right'} eye")
#             result = extract_single_eye(image, left_eye=try_left_eye)
#             if result is not None:
#                 eye_result = result
#                 logger.info(f"Successfully extracted {'left' if try_left_eye else 'right'} eye")
#                 break
        
#         if eye_result is None:
#             logger.error("No eyes detected in the image.")
#             # Fallback to a default eye color if needed
#             fallback_color = "Brown"  # Most common eye color
#             logger.warning(f"Using fallback eye color: {fallback_color}")
#             os.remove(saved_image_path)  # Clean up
#             return {"message": "warning", "result": {"result": fallback_color, "note": "Using default color - no eye detected"}}
        
#         eye_image, bbox = eye_result
        
#         # Save intermediate eye image for debugging
#         cv2.imwrite("eye_extract.jpg", eye_image)
#         logger.info(f"Extracted eye dimensions: {eye_image.shape[1]}x{eye_image.shape[0]}")
        
#         # Enhance eye image
#         enhanced_eye = enhance_eye_image(eye_image)
#         cv2.imwrite("eye_enhanced.jpg", enhanced_eye)
#         logger.info(f"Enhanced eye dimensions: {enhanced_eye.shape[1]}x{enhanced_eye.shape[0]}")
        
#         # Check for minimum size before prediction
#         if enhanced_eye.shape[0] < 50 or enhanced_eye.shape[1] < 50:
#             logger.warning("Eye image too small for reliable prediction")
#             # Resize to minimum dimensions expected by the model
#             enhanced_eye = cv2.resize(enhanced_eye, (224, 224))
#             logger.info("Resized small eye image to 224x224")

#         # Predict eye color
#         logger.info("Attempting to predict eye color")
#         color_class, confidence = predict_eye_color(eye_color_model, enhanced_eye)
        
#         if color_class is None:
#             logger.warning("No eye color predicted by model, using fallback method")
#             # Simple RGB analysis as fallback
#             fallback_color = analyze_eye_color_fallback(enhanced_eye)
#             os.remove(saved_image_path)  # Clean up
#             return {"message": "warning", "result": {"result": fallback_color, "note": "Using simple color analysis"}}
        
#         logger.info(f"Eye color predicted: {color_class} with confidence {confidence:.2f}")
        
#         # Clean up temporary files
#         os.remove(saved_image_path)
#         try:
#             os.remove("eye_extract.jpg")
#             os.remove("eye_enhanced.jpg")
#         except:
#             pass  # Ignore cleanup errors
            
#         result_data = {'result': color_class, 'confidence': float(confidence)}
#         return {"message": "complete", "result": result_data}
#     except Exception as e:
#         logger.error(f"Error processing eye: {e}")
#         # Log detailed error and stack trace
#         import traceback
#         logger.error(traceback.format_exc())
        
#         # Fallback to a default eye color
#         fallback_color = "Brown"  # Most common eye color
#         return {"message": "error", "result": {"result": fallback_color, "note": f"Error: {str(e)}"}}
        
# def analyze_eye_color_fallback(eye_image):
#     """
#     Simple RGB analysis to determine the eye color when model prediction fails
#     """
#     # Convert to RGB for analysis
#     eye_rgb = cv2.cvtColor(eye_image, cv2.COLOR_BGR2RGB)
    
#     # Get center region of the eye (iris)
#     h, w = eye_rgb.shape[:2]
#     center_x, center_y = w // 2, h // 2
#     radius = min(h, w) // 4
    
#     # Extract center region
#     y_start = max(0, center_y - radius)
#     y_end = min(h, center_y + radius)
#     x_start = max(0, center_x - radius)
#     x_end = min(w, center_x + radius)
    
#     center_region = eye_rgb[y_start:y_end, x_start:x_end]
    
#     # Get average color
#     avg_color = np.mean(center_region, axis=(0, 1))
#     r, g, b = avg_color
    
#     # Simple classification based on RGB values
#     if r > 100 and g > 100 and b > 150:  # Blue has higher blue component
#         return "Blue"
#     elif r > 100 and g > 80 and b < 80:  # Amber/Hazel has higher red/green components
#         return "Amber"
#     elif r > 120 and g > 100 and 80 < b < 120:  # Hazel often has a balance
#         return "Hazel"
#     elif r > 100 and g > 100 and b > 100 and max(r, g, b) - min(r, g, b) < 30:  # Grey has balanced RGB
#         return "Grey"
#     elif g > r and g > b:  # Green has higher green component
#         return "Green"
#     else:  # Default to brown, the most common
#         return "Brown"

# async def process_lip(data: dict):
#     try:
#         logger.info("Processing image for lip color analysis.")
#         image_data = data["image"]
#         decoded_image = base64.b64decode(image_data.split(",")[1])

#         with open("saved.jpg", "wb") as fi:
#             fi.write(decoded_image)
#         logger.info("Image saved as saved.jpg.")

#         path = "saved.jpg"
#         rgb_codes = f.get_rgb_codes(path)
#         random_rgb_codes = f.filter_lip_random(rgb_codes, 40)

#         os.remove("saved.jpg")
#         logger.info("Processed RGB codes and saved random sample.")

#         types = Counter(f.calc_dis(random_rgb_codes))
#         max_value_key = max(types, key=types.get)
#         logger.info(f"Processed lip result: {max_value_key}")

#         # Map the results to the season names
#         lip_seasons = {'sp': 'spring', 'su': 'summer', 'au': 'autumn', 'win': 'winter'}
#         lip_season = lip_seasons.get(max_value_key, 'unknown')

#         result_data = {'result': lip_season}
#         return {"message": "complete", "result": result_data}
#     except Exception as e:
#         logger.error(f"Error processing lip: {e}")
#         raise HTTPException(status_code=500, detail=f"Lip analysis failed: {str(e)}")

# def extract_single_eye(image, left_eye=True):
#     """
#     Extract single eye from a face image using MediaPipe.
#     """
#     # Initialize MediaPipe Face Mesh
#     mp_face_mesh = mp.solutions.face_mesh
#     face_mesh = mp_face_mesh.FaceMesh(
#         static_image_mode=True,
#         max_num_faces=1,
#         refine_landmarks=True,
#         min_detection_confidence=0.5
#     )

#     # Convert to RGB (MediaPipe requires RGB input)
#     if len(image.shape) == 2:  # If grayscale
#         image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
#     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     height, width = image.shape[:2]
    
#     # Detect facial landmarks
#     results = face_mesh.process(image_rgb)
    
#     if not results.multi_face_landmarks:
#         logger.warning("No face detected!")
#         return None
    
#     landmarks = results.multi_face_landmarks[0].landmark
    
#     # Define eye landmarks indices
#     if left_eye:
#         # Left eye landmarks
#         eye_indices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
#     else:
#         # Right eye landmarks
#         eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    
#     # Get eye coordinates
#     eye_coords = np.array([(int(landmarks[idx].x * width), int(landmarks[idx].y * height)) 
#                           for idx in eye_indices])
    
#     # Calculate bounding box with padding
#     x_min, y_min = np.min(eye_coords, axis=0)
#     x_max, y_max = np.max(eye_coords, axis=0)
    
#     # Add padding (30% of eye size)
#     eye_width = x_max - x_min
#     eye_height = y_max - y_min
#     padding_x = int(eye_width * 0.3)
#     padding_y = int(eye_height * 0.3)
    
#     # Ensure padded coordinates are within image bounds
#     x_min = max(0, x_min - padding_x)
#     y_min = max(0, y_min - padding_y)
#     x_max = min(width, x_max + padding_x)
#     y_max = min(height, y_max + padding_y)
    
#     # Crop eye region
#     eye_image = image[y_min:y_max, x_min:x_max]
    
#     # Release resources
#     face_mesh.close()
    
#     return eye_image, (x_min, y_min, x_max, y_max)

# def enhance_eye_image(eye_image):
#     """
#     Enhance the extracted eye image quality.
#     """
#     # Resize to ensure minimum size
#     min_size = 224
#     h, w = eye_image.shape[:2]
#     if h < min_size or w < min_size:
#         scale = min_size / min(h, w)
#         eye_image = cv2.resize(eye_image, (int(w * scale), int(h * scale)), 
#                              interpolation=cv2.INTER_LANCZOS4)
    
#     # Convert to LAB color space
#     lab = cv2.cvtColor(eye_image, cv2.COLOR_BGR2LAB)
#     l, a, b = cv2.split(lab)
    
#     # Apply CLAHE
#     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
#     cl = clahe.apply(l)
    
#     # Merge channels
#     enhanced_lab = cv2.merge((cl, a, b))
#     enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
#     # Denoise
#     enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
#     return enhanced_bgr

# def predict_eye_color(model, eye_image):
#     """
#     Predict eye color using the YOLO model.
#     """
#     try:
#         # Save input image for debugging
#         cv2.imwrite("yolo_input.jpg", eye_image)
        
#         # Make prediction with additional parameters for reliability
#         results = model(eye_image, conf=0.25, verbose=True)[0]
        
#         logger.info(f"YOLO prediction results: {len(results.boxes)} detections")
        
#         # Get the prediction with highest confidence
#         if len(results.boxes) > 0:
#             # Get confidence scores and class indices
#             confidences = results.boxes.conf
#             class_indices = results.boxes.cls
            
#             # Log all detected classes and confidences
#             for i in range(len(confidences)):
#                 class_idx = int(class_indices[i])
#                 conf = float(confidences[i])
#                 class_name = results.names[class_idx]
#                 logger.info(f"Detection {i}: {class_name} with confidence {conf:.2f}")
            
#             # Get index of highest confidence
#             max_conf_idx = confidences.argmax()
            
#             # Get class name and confidence
#             class_idx = int(class_indices[max_conf_idx])
#             confidence = float(confidences[max_conf_idx])
#             class_name = results.names[class_idx]
            
#             logger.info(f"Selected eye color: {class_name} with confidence {confidence:.2f}")
#             return class_name, confidence
        
#         logger.warning("No eye color predicted by YOLO model.")
#         return None, None
#     except Exception as e:
#         logger.error(f"Error in YOLO prediction: {str(e)}")
#         import traceback
#         logger.error(traceback.format_exc())
#         return None, None

# def get_color_recommendations(skin_tone: int, eye_color: str):
#     """
#     Get color recommendations based on skin tone and eye color.
#     Skin tone maps to a season (spring, summer, autumn, winter).
#     Eye color refines the color palette within the season.
#     """
#     # Map skin tone to a season
#     season_mapping = {
#         1: "spring",
#         2: "summer",
#         3: "autumn",
#         4: "winter"
#     }

#     # Determine the season based on skin tone
#     season = season_mapping.get(skin_tone, "unknown")

#     # Provide color recommendations based on the season and eye color
#     seasonal_colors = {
#         "spring": {
#             "Amber": ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
#             "Blue": ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
#             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
#             "Green": ["#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98"],
#             "Grey": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#A9A9A9"],
#             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
#         },
#         "summer": {
#             "Amber": ["#FFA07A", "#FF8C69", "#FF7F50", "#FF6347", "#FF4500", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
#             "Blue": ["#6495ED", "#4682B4", "#5F9EA0", "#00CED1", "#40E0D0", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0"],
#             "Brown": ["#A0522D", "#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
#             "Green": ["#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371"],
#             "Grey": ["#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
#             "Hazel": ["#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C"]
#         },
#         "autumn": {
#             "Amber": ["#FF7F50", "#FF6347", "#FF4500", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
#             "Blue": ["#4169E1", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3"],
#             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
#             "Green": ["#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
#             "Grey": ["#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969"],
#             "Hazel": ["#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD"]
#         },
#         "winter": {
#             "Amber": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
#             "Blue": ["#00008B", "#0000CD", "#1E90FF", "#4169E1", "#6495ED", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
#             "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
#             "Green": ["#228B22", "#2E8B57", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
#             "Grey": ["#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899"],
#             "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
#         }
#     }

#     # Get the color recommendations for the season and eye color
#     return seasonal_colors.get(season, {}).get(eye_color, [])

# if __name__ == "__main__":
#     import uvicorn
#     logger.info("Starting server...")
#     uvicorn.run(app, host="localhost", port=8000, reload=True)

import base64
import os
import logging
from collections import Counter
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
import cv2
import mediapipe as mp
import numpy as np
from ultralytics import YOLO

# Import your existing modules
import functions as f
import skin_model as m

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for frontend communication
origins = [
    "http://localhost:3000",  # Your frontend application (if any)
    "http://localhost:8000"   # Your FastAPI application
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

# Load YOLO model for eye color detection
model_path = 'best.pt'  # Replace with your model path
eye_color_model = YOLO(model_path)

@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    logger.info("Serving root endpoint.")
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    try:
        logger.info("Received image upload request.")
        contents = await file.read()
        image_data = base64.b64encode(contents).decode('utf-8')
        image_data = f"data:image/jpeg;base64,{image_data}"

        payload = {"image": image_data}
        
        # Process skin tone
        response_skin = await process_skin(payload)
        logger.info(f"Skin tone processing complete: {response_skin}")
        
        # Process eye color
        response_eye = await process_eye(payload)
        logger.info(f"Eye color processing complete: {response_eye}")
        
        # Process lip color from original code if needed
        # response_lip = await process_lip(payload)

        # Get color recommendations based on skin tone and eye color
        color_recommendations = get_color_recommendations(
            response_skin["result"]["result"], 
            response_eye["result"]["result"]
        )
        logger.info(f"Generated {len(color_recommendations)} color recommendations")

        # Process completed successfully
        return JSONResponse(content={
            "response_skin": response_skin,
            "response_eye": response_eye,
            "color_recommendations": color_recommendations
        })
    except Exception as e:
        logger.error(f"Error processing upload_image: {e}")
        logger.error(f"Exception details: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        
        # Return a graceful error response with default values
        default_response = {
            "response_skin": {"message": "error", "result": {"result": 3, "season": "autumn"}},
            "response_eye": {"message": "error", "result": {"result": "Brown"}},
            "color_recommendations": get_color_recommendations(3, "Brown"),
            "error": str(e)
        }
        return JSONResponse(
            status_code=200,  # Return 200 even on error for graceful frontend handling
            content=default_response
        )

async def process_skin(data: dict):
    try:
        logger.info("Processing image for skin tone analysis.")

        # Extract and decode the image
        image_data = data["image"]
        decoded_image = base64.b64decode(image_data.split(",")[1])

        # Save the decoded image
        saved_image_path = "saved.jpg"
        with open(saved_image_path, "wb") as fi:
            fi.write(decoded_image)
        logger.info("Image saved as saved.jpg.")

        # Process the saved image to generate a skin mask
        f.save_skin_mask(saved_image_path)
        logger.info("Skin mask saved as temp.jpg.")
        
        # Determine the season from the skin mask
        season_image_path = "temp.jpg"
        ans = m.get_season(season_image_path)

        # Clean up temporary files
        os.remove(season_image_path)
        os.remove(saved_image_path)

        # Adjust the season result according to the mapping
        if ans == 3:
            ans += 1
        elif ans == 0:
            ans = 3

        # Mapping of the season result to season names
        seasons = {1: "spring", 2: "summer", 3: "autumn", 4: "winter"}
        season_name = seasons.get(ans, "unknown")
        
        result = {'result': ans, 'season': season_name}
        logger.info(f"Processed skin tone result: {result}")

        return {"message": "complete", "result": result}
    except Exception as e:
        logger.error(f"Error processing skin: {e}")
        raise HTTPException(status_code=500, detail=f"Skin analysis failed: {str(e)}")

async def process_eye(data: dict):
    try:
        logger.info("Processing image for eye color analysis.")
        image_data = data["image"]
        decoded_image = base64.b64decode(image_data.split(",")[1])

        # Save the decoded image
        saved_image_path = "saved_eye.jpg"
        with open(saved_image_path, "wb") as fi:
            fi.write(decoded_image)
        logger.info(f"Image saved as {saved_image_path}.")

        # Read the image
        image = cv2.imread(saved_image_path)
        if image is None:
            logger.error("Error loading image.")
            # Return default instead of raising an exception
            return {"message": "error", "result": {"result": "Brown"}}

        # Save original dimensions for debugging
        original_height, original_width = image.shape[:2]
        logger.info(f"Original image dimensions: {original_width}x{original_height}")

        # Try both eyes in case one fails
        eye_result = None
        for try_left_eye in [True, False]:
            logger.info(f"Attempting to extract {'left' if try_left_eye else 'right'} eye")
            result = extract_single_eye(image, left_eye=try_left_eye)
            if result is not None:
                eye_result = result
                logger.info(f"Successfully extracted {'left' if try_left_eye else 'right'} eye")
                break
        
        if eye_result is None:
            logger.error("No eyes detected in the image.")
            # Return default instead of using fallback logic
            return {"message": "error", "result": {"result": "Brown"}}
        
        eye_image, bbox = eye_result
        
        # Save intermediate eye image for debugging
        cv2.imwrite("eye_extract.jpg", eye_image)
        logger.info(f"Extracted eye dimensions: {eye_image.shape[1]}x{eye_image.shape[0]}")
        
        # Enhance eye image
        enhanced_eye = enhance_eye_image(eye_image)
        cv2.imwrite("eye_enhanced.jpg", enhanced_eye)
        logger.info(f"Enhanced eye dimensions: {enhanced_eye.shape[1]}x{enhanced_eye.shape[0]}")
        
        # Check for minimum size before prediction
        if enhanced_eye.shape[0] < 50 or enhanced_eye.shape[1] < 50:
            logger.warning("Eye image too small for reliable prediction")
            # Resize to minimum dimensions expected by the model
            enhanced_eye = cv2.resize(enhanced_eye, (224, 224))
            logger.info("Resized small eye image to 224x224")

        # Predict eye color
        logger.info("Attempting to predict eye color")
        color_class, confidence = predict_eye_color(eye_color_model, enhanced_eye)
        
        if color_class is None:
            logger.warning("No eye color predicted by model, using fallback method")
            # Simple RGB analysis as fallback
            fallback_color = analyze_eye_color_fallback(enhanced_eye)
            os.remove(saved_image_path)  # Clean up
            # IMPORTANT: Return structure matches what frontend expects
            return {"message": "complete", "result": {"result": fallback_color}}
        
        logger.info(f"Eye color predicted: {color_class} with confidence {confidence:.2f}")
        
        # Clean up temporary files
        os.remove(saved_image_path)
        try:
            os.remove("eye_extract.jpg")
            os.remove("eye_enhanced.jpg")
        except:
            pass  # Ignore cleanup errors
            
        # IMPORTANT: Return structure matches what frontend expects
        result_data = {'result': color_class}
        return {"message": "complete", "result": result_data}
    except Exception as e:
        logger.error(f"Error processing eye: {e}")
        # Log detailed error and stack trace
        import traceback
        logger.error(traceback.format_exc())
        
        # Return structure matching what frontend expects
        return {"message": "error", "result": {"result": "Brown"}}
        
def analyze_eye_color_fallback(eye_image):
    """
    Simple RGB analysis to determine the eye color when model prediction fails
    """
    # Convert to RGB for analysis
    eye_rgb = cv2.cvtColor(eye_image, cv2.COLOR_BGR2RGB)
    
    # Get center region of the eye (iris)
    h, w = eye_rgb.shape[:2]
    center_x, center_y = w // 2, h // 2
    radius = min(h, w) // 4
    
    # Extract center region
    y_start = max(0, center_y - radius)
    y_end = min(h, center_y + radius)
    x_start = max(0, center_x - radius)
    x_end = min(w, center_x + radius)
    
    center_region = eye_rgb[y_start:y_end, x_start:x_end]
    
    # Get average color
    avg_color = np.mean(center_region, axis=(0, 1))
    r, g, b = avg_color
    
    # Simple classification based on RGB values
    if r > 100 and g > 100 and b > 150:  # Blue has higher blue component
        return "Blue"
    elif r > 100 and g > 80 and b < 80:  # Amber/Hazel has higher red/green components
        return "Amber"
    elif r > 120 and g > 100 and 80 < b < 120:  # Hazel often has a balance
        return "Hazel"
    elif r > 100 and g > 100 and b > 100 and max(r, g, b) - min(r, g, b) < 30:  # Grey has balanced RGB
        return "Grey"
    elif g > r and g > b:  # Green has higher green component
        return "Green"
    else:  # Default to brown, the most common
        return "Brown"

async def process_lip(data: dict):
    try:
        logger.info("Processing image for lip color analysis.")
        image_data = data["image"]
        decoded_image = base64.b64decode(image_data.split(",")[1])

        with open("saved.jpg", "wb") as fi:
            fi.write(decoded_image)
        logger.info("Image saved as saved.jpg.")

        path = "saved.jpg"
        rgb_codes = f.get_rgb_codes(path)
        random_rgb_codes = f.filter_lip_random(rgb_codes, 40)

        os.remove("saved.jpg")
        logger.info("Processed RGB codes and saved random sample.")

        types = Counter(f.calc_dis(random_rgb_codes))
        max_value_key = max(types, key=types.get)
        logger.info(f"Processed lip result: {max_value_key}")

        # Map the results to the season names
        lip_seasons = {'sp': 'spring', 'su': 'summer', 'au': 'autumn', 'win': 'winter'}
        lip_season = lip_seasons.get(max_value_key, 'unknown')

        result_data = {'result': lip_season}
        return {"message": "complete", "result": result_data}
    except Exception as e:
        logger.error(f"Error processing lip: {e}")
        raise HTTPException(status_code=500, detail=f"Lip analysis failed: {str(e)}")

def extract_single_eye(image, left_eye=True):
    """
    Extract single eye from a face image using MediaPipe.
    """
    # Initialize MediaPipe Face Mesh
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5
    )

    # Convert to RGB (MediaPipe requires RGB input)
    if len(image.shape) == 2:  # If grayscale
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    height, width = image.shape[:2]
    
    # Detect facial landmarks
    results = face_mesh.process(image_rgb)
    
    if not results.multi_face_landmarks:
        logger.warning("No face detected!")
        return None
    
    landmarks = results.multi_face_landmarks[0].landmark
    
    # Define eye landmarks indices
    if left_eye:
        # Left eye landmarks - using a simpler set focused on the entire eye region
        eye_indices = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382]
    else:
        # Right eye landmarks
        eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    
    # Get eye coordinates
    eye_coords = np.array([(int(landmarks[idx].x * width), int(landmarks[idx].y * height)) 
                          for idx in eye_indices])
    
    # Calculate bounding box with padding
    x_min, y_min = np.min(eye_coords, axis=0)
    x_max, y_max = np.max(eye_coords, axis=0)
    
    # Check if eye dimensions are too small or malformed
    eye_width = x_max - x_min
    eye_height = y_max - y_min
    
    # If eye dimensions look wrong, try a more conservative approach
    if eye_width < 20 or eye_height < 10 or (eye_width / eye_height > 5):
        logger.warning(f"Suspicious eye dimensions detected: {eye_width}x{eye_height}, trying face detection fallback")
        # Try a different approach - use face detection to estimate eye region
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # Convert to grayscale for Haar cascade
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) > 0:
            x, y, w, h = faces[0]
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = image[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            
            if len(eyes) > 0:
                # Sort eyes by x-coordinate
                eyes = sorted(eyes, key=lambda e: e[0])
                
                # Select left or right eye based on parameter
                eye_idx = 0 if left_eye else -1
                if 0 <= eye_idx < len(eyes):
                    ex, ey, ew, eh = eyes[eye_idx]
                    # Add padding
                    padding_x = int(ew * 0.3)
                    padding_y = int(eh * 0.3)
                    
                    x_min = max(0, x + ex - padding_x)
                    y_min = max(0, y + ey - padding_y)
                    x_max = min(width, x + ex + ew + padding_x)
                    y_max = min(height, y + ey + eh + padding_y)
                    
                    eye_image = image[y_min:y_max, x_min:x_max]
                    logger.info(f"Used Haar cascade for eye detection: {x_max-x_min}x{y_max-y_min}")
                    
                    face_mesh.close()
                    return eye_image, (x_min, y_min, x_max, y_max)
    
    # Add significant padding for the eye region (50% of eye size)
    padding_x = int(eye_width * 0.5)
    padding_y = int(eye_height * 0.5)
    
    # Ensure padded coordinates are within image bounds
    x_min = max(0, x_min - padding_x)
    y_min = max(0, y_min - padding_y)
    x_max = min(width, x_max + padding_x)
    y_max = min(height, y_max + padding_y)
    
    # Make sure the eye has reasonable dimensions
    if (x_max - x_min) < 30 or (y_max - y_min) < 20:
        # If the eye is too small, try to get a bigger region
        center_x = (x_min + x_max) // 2
        center_y = (y_min + y_max) // 2
        x_min = max(0, center_x - 50)
        y_min = max(0, center_y - 40)
        x_max = min(width, center_x + 50)
        y_max = min(height, center_y + 40)
    
    # Crop eye region
    eye_image = image[y_min:y_max, x_min:x_max]
    
    # Release resources
    face_mesh.close()
    
    # Check if we got a valid eye image
    if eye_image.size == 0 or eye_image.shape[0] < 10 or eye_image.shape[1] < 10:
        logger.warning("Invalid eye dimensions after extraction")
        return None
        
    return eye_image, (x_min, y_min, x_max, y_max)

def enhance_eye_image(eye_image):
    """
    Enhance the extracted eye image quality.
    """
    # Resize to ensure minimum size
    min_size = 224
    h, w = eye_image.shape[:2]
    if h < min_size or w < min_size:
        scale = min_size / min(h, w)
        eye_image = cv2.resize(eye_image, (int(w * scale), int(h * scale)), 
                             interpolation=cv2.INTER_LANCZOS4)
    
    # Convert to LAB color space
    lab = cv2.cvtColor(eye_image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    
    # Merge channels
    enhanced_lab = cv2.merge((cl, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    # Denoise
    enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr, None, 10, 10, 7, 21)
    
    return enhanced_bgr

def predict_eye_color(model, eye_image):
    """
    Predict eye color using the YOLO model.
    """
    try:
        # Save input image for debugging
        cv2.imwrite("yolo_input.jpg", eye_image)
        
        # Make prediction with additional parameters for reliability
        results = model(eye_image, conf=0.25, verbose=True)[0]
        
        logger.info(f"YOLO prediction results: {len(results.boxes)} detections")
        
        # Get the prediction with highest confidence
        if len(results.boxes) > 0:
            # Get confidence scores and class indices
            confidences = results.boxes.conf
            class_indices = results.boxes.cls
            
            # Log all detected classes and confidences
            for i in range(len(confidences)):
                class_idx = int(class_indices[i])
                conf = float(confidences[i])
                class_name = results.names[class_idx]
                logger.info(f"Detection {i}: {class_name} with confidence {conf:.2f}")
            
            # Get index of highest confidence
            max_conf_idx = confidences.argmax()
            
            # Get class name and confidence
            class_idx = int(class_indices[max_conf_idx])
            confidence = float(confidences[max_conf_idx])
            class_name = results.names[class_idx]
            
            logger.info(f"Selected eye color: {class_name} with confidence {confidence:.2f}")
            return class_name, confidence
        
        logger.warning("No eye color predicted by YOLO model.")
        return None, None
    except Exception as e:
        logger.error(f"Error in YOLO prediction: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return None, None

def get_color_recommendations(skin_tone: int, eye_color: str):
    """
    Get color recommendations based on skin tone and eye color.
    Skin tone maps to a season (spring, summer, autumn, winter).
    Eye color refines the color palette within the season.
    """
    # Map skin tone to a season
    season_mapping = {
        1: "spring",
        2: "summer",
        3: "autumn",
        4: "winter"
    }

    # Determine the season based on skin tone
    season = season_mapping.get(skin_tone, "unknown")

    # Provide color recommendations based on the season and eye color
    seasonal_colors = {
        "spring": {
            "Amber": ["#FFDDC1", "#FFE4E1", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFEFD5", "#FFF8DC", "#FFFACD", "#FFFFE0", "#FFF5EE"],
            "Blue": ["#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
            "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
            "Green": ["#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98"],
            "Grey": ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#A9A9A9"],
            "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
        },
        "summer": {
            "Amber": ["#FFA07A", "#FF8C69", "#FF7F50", "#FF6347", "#FF4500", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
            "Blue": ["#6495ED", "#4682B4", "#5F9EA0", "#00CED1", "#40E0D0", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3", "#C0C0C0"],
            "Brown": ["#A0522D", "#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
            "Green": ["#3CB371", "#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371"],
            "Grey": ["#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080"],
            "Hazel": ["#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C"]
        },
        "autumn": {
            "Amber": ["#FF7F50", "#FF6347", "#FF4500", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
            "Blue": ["#4169E1", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0F8FF", "#D3D3D3"],
            "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
            "Green": ["#2E8B57", "#228B22", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
            "Grey": ["#808080", "#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969"],
            "Hazel": ["#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD"]
        },
        "winter": {
            "Amber": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C69", "#FFA07A", "#FFDAB9", "#FFE4B5", "#FFEFD5", "#FFFACD", "#FFF5EE"],
            "Blue": ["#00008B", "#0000CD", "#1E90FF", "#4169E1", "#6495ED", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF"],
            "Brown": ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFA07A", "#FF8C69", "#FF7F50", "#FF6347"],
            "Green": ["#228B22", "#2E8B57", "#6B8E23", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#8FBC8F", "#3CB371", "#2E8B57"],
            "Grey": ["#696969", "#778899", "#708090", "#2F4F4F", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080", "#696969", "#778899"],
            "Hazel": ["#B8860B", "#DAA520", "#FFD700", "#EEE8AA", "#F0E68C", "#FFDEAD", "#B8860B", "#DAA520", "#FFD700", "#EEE8AA"]
        }
    }

    # Get the color recommendations for the season and eye color
    return seasonal_colors.get(season, {}).get(eye_color, [])

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="localhost", port=8001, reload=True)