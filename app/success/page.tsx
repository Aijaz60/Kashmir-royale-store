import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg w-full">

        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-4xl font-bold text-green-600">
          Payment Successful
        </h1>

        <p className="text-gray-600 mt-4">
          Thank you for shopping with Kashmir Royale.
        </p>

        <p className="text-gray-500 mt-2">
          Your order has been placed successfully.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-yellow-500 hover:bg-yellow-400 px-8 py-3 rounded-xl font-bold transition"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}