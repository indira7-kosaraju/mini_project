import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { activateMembership } from "../../services/mockApi";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const plan = query.get("plan");

    useEffect(() => {
        activateMembership(plan).then(() => {
            navigate("/memberdashboard");
        });
    }, []);

    return <h1>Payment Successful 🎉 Activating your plan...</h1>;
};

export default PaymentSuccess;
