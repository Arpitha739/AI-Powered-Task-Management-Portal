import api from "./api";

export const generateTaskWithAI = async (title) => {

    const response = await api.post(
        "/api/ai/generate",
        {
            title
        }
    );

    return response.data;
};