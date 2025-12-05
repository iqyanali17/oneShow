import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { axios, user } = useAppContext();

  const presetState = location.state || {};
  const [movieName, setMovieName] = useState(presetState.movieName || "");
  const [amount, setAmount] = useState(presetState.amount || "");
  const [bookingId, setBookingId] = useState(presetState.bookingId || "");
  const [isPaying, setIsPaying] = useState(false);
  const [result, setResult] = useState(null); // { status, transactionId?, reason? }

  useEffect(() => {
    // Reset result whenever inputs change
    setResult(null);
  }, [movieName, amount]);

  const handlePay = async (e) => {
    e.preventDefault();

    if (!movieName || !amount) {
      toast.error("Please enter both movie name and amount");
      return;
    }

    setIsPaying(true);
    setResult(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Unable to load Razorpay SDK. Please check your connection.");
        setIsPaying(false);
        return;
      }

      // 1) Ask backend to create Razorpay order
      const { data } = await axios.post("/api/payment/create-order", {
        movieName,
        amount: Number(amount),
        currency: "USD"
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to create payment order");
        setIsPaying(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Movie Ticket",
        description: `Payment for ${movieName}`,
        order_id: data.orderId,
        prefill: {
          name: user?.fullName || "Test User",
          email: user?.primaryEmailAddress?.emailAddress || "test@example.com",
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false,
          confirm_close: true,
          animation: "slideIn",
          ondismiss: () => {
            if (!result) {
              setResult({ status: "failed", reason: "Payment popup closed" });
              toast.error("Payment cancelled");
            }
            setIsPaying(false);
          },
        },
        notes: {
          "test_mode": "1",
          "movie_name": movieName
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId, // Include booking ID to update payment status
            });

            if (verifyRes.data?.success) {
              setResult({ status: "success", transactionId: response.razorpay_payment_id });
              toast.success("Payment successful");
              
              // Redirect to MyBookings after successful payment
              setTimeout(() => {
                navigate('/my-bookings', { state: { paymentSuccess: true } });
              }, 2000);
            } else {
              setResult({ status: "failed", reason: verifyRes.data?.message || "Verification failed" });
              toast.error(verifyRes.data?.message || "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            setResult({ status: "failed", reason: "Error while verifying payment" });
            toast.error("Error while verifying payment");
          } finally {
            setIsPaying(false);
          }
        },
      };

      const razorpayObject = new window.Razorpay(options);
      razorpayObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Unable to process payment");
      setIsPaying(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === "success") {
      return (
        <div className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-emerald-200">
          <h2 className="text-lg font-semibold">Payment Successful</h2>
          <p className="mt-2 text-sm">
            Transaction ID: <span className="font-mono">{result.transactionId}</span>
          </p>
          <p className="mt-2 text-sm text-emerald-300">
            Redirecting to your bookings...
          </p>
        </div>
      );
    }

    if (result.status === "failed") {
      return (
        <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-4 text-red-200">
          <h2 className="text-lg font-semibold">Payment Failed</h2>
          <p className="mt-2 text-sm">Reason: {result.reason || "Unknown"}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] flex items-center justify-center">
      <BlurCircle top="80px" left="40px" />
      <BlurCircle bottom="-40px" right="120px" />

      <div className="w-full max-w-lg rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-primary/5 p-8 backdrop-blur-lg shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <CreditCardIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Secure Payment</h1>
          <p className="text-sm text-gray-300">
            Complete your movie ticket purchase safely and securely
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 rounded-lg border border-primary/30 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
            <CreditCardIcon className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-gray-300">Card</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg border border-primary/30 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
            <DevicePhoneMobileIcon className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-gray-300">UPI</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg border border-primary/30 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
            <BanknotesIcon className="w-6 h-6 text-primary mb-1" />
            <span className="text-xs text-gray-300">Net Banking</span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <ShieldCheckIcon className="w-5 h-5 text-green-400" />
          <span className="text-xs text-green-300">256-bit SSL Encryption</span>
        </div>

        <form onSubmit={handlePay} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Movie Name</label>
            <input
              type="text"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              className="w-full rounded-lg border border-primary/40 bg-black/40 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Enter movie name"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Amount (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">$</span>
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-primary/40 bg-black/40 pl-8 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0.00"
                required
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPaying}
            className="mt-6 w-full rounded-full bg-linear-to-r from-primary to-primary/80 px-6 py-3 text-sm font-semibold text-white hover:from-primary/90 hover:to-primary/70 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isPaying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4" />
                Pay Securely
              </>
            )}
          </button>
        </form>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-primary/20">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <LockClosedIcon className="w-3 h-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheckIcon className="w-3 h-3" />
              <span>Protected</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCardIcon className="w-3 h-3" />
              <span>Fast</span>
            </div>
          </div>
        </div>

        {renderResult()}
      </div>
    </div>
  );
};

export default Payment;
