import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-2">
          🎉 Account Created!
        </h1>

        

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
        >
          Account created
        </Button>
      </div>
    </div>
  );
}