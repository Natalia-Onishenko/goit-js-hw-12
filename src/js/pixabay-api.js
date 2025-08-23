import axios from "axios";

const API_KEY = "51915317-a5ee9a5ba63d3f1e31a6123a4";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 15,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка запиту до Pixabay API:", error);
    return null;
  }
}