import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  console.log("Success.tsx loaded!"); // ✅ Check if this appears in console

  // Log sessionId and see if it's being picked up correctly
  console.log("Session ID from URL:", sessionId);

  useEffect(() => {
    if (sessionId) {
      console.log("Checkout session ID:", sessionId);
      // Here you can make an API call to verify the session with your backend
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
    </div>
  );
};

export default Success;
