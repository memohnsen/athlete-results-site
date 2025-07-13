import Link from "next/link";
import Header from '../components/Header'
import AthleteTable from "../components/AthleteTable"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold">The Home To All Your Athletes Results</h1>
          <p className="mt-8 text-lg mb-10">Search by Athlete or Meet to find full results for all USAW athletes</p>
        </div>

        <AthleteTable />
      </main>

      <Footer />
    </div>
  );
}
