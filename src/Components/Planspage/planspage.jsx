import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Tag } from "lucide-react";
import { getMemberProfile, activateMembership, validateCoupon } from "../../services/mockApi";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import toast from "react-hot-toast";

const Planspage = () => {
  const [loading, setLoading] = useState(false);
  const [memberProfile, setMemberProfile] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const data = await getMemberProfile();
      setMemberProfile(data);

      if (data.membership?.status === "active") {
        navigate("/memberdashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const plans = [
    {
      name: "Basic Plan",
      price: 2500,
      features: [
        "Access to gym equipment",
        "Basic workout plans",
        "Locker room access",
        "1 free trainer session",
        "Access to fitness classes",
      ],
    },
    {
      name: "Premium Plan",
      price: 3000,
      features: [
        "All Basic Plan features",
        "3 trainer sessions/month",
        "Nutrition consultation",
        "Access to premium classes",
        "Sauna & spa access",
      ],
      popular: true,
    },
    {
      name: "Pro Plan",
      price: 4500,
      features: [
        "All Premium Plan features",
        "Unlimited trainer sessions",
        "Personalized workout plans",
        "Priority booking",
        "Exclusive member events",
      ],
    },
  ];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    const coupon = await validateCoupon(couponCode.trim().toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      toast.success(`${coupon.discount}% coupon applied`);
    } else {
      toast.error("Invalid coupon");
    }
  };

  const getFinalPrice = (price) => {
    if (!appliedCoupon) return price;
    return price - (price * appliedCoupon.discount) / 100;
  };

  // ✅ DEMO PAYMENT FUNCTION
  const handlePayment = async (plan) => {
    try {
      setLoading(true);

      const finalPrice = getFinalPrice(plan.price);

      // fake delay (demo payment)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // activate membership (demo - stored in localStorage)
      await activateMembership(plan.name);

      localStorage.setItem("isPaid", "true");

      toast.success("Payment Successful 🎉");
      navigate("/memberdashboard");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown
          username={memberProfile?.username || "Member"}
          userType="member"
        />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Choose Your Perfect Plan
        </h1>
        <p className="text-gray-400">
          Simple demo payment for project submission
        </p>
      </div>

      {/* Coupon */}
      <div className="flex justify-center mb-8">
        {appliedCoupon ? (
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center">
            <Tag size={18} className="mr-2" />
            Coupon {appliedCoupon.code} applied ({appliedCoupon.discount}%)
          </div>
        ) : (
          <div className="flex">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="bg-gray-800 text-white px-4 py-2 rounded-l-lg"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-orange-500 px-4 py-2 rounded-r-lg text-white"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => {
          const finalPrice = getFinalPrice(plan.price);
          return (
            <div
              key={i}
              className={`bg-gray-800 p-8 rounded-2xl shadow-xl ${
                plan.popular ? "border-2 border-orange-500" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {plan.name}
              </h3>

              <div className="text-3xl font-bold text-orange-500 mb-4">
                ₹{finalPrice}
                <span className="text-sm text-gray-400"> / month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex text-gray-300">
                    <Check className="text-orange-500 mr-2" size={18} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-lg text-white font-semibold flex justify-center items-center disabled:opacity-50"
              >
                {loading ? "Processing..." : "Get Started"}
                {!loading && (
                  <ArrowRight className="ml-2" size={18} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Planspage;
