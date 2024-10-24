import Link from "next/link";

export default function Home() {
  return (
  <div className="h-screen w-screen flex flex-col justify-center items-center">
  <h1 className="text-[90px] text-slate-600">Restaurent Pos</h1>
  <ul className="flex justify-center items-center gap-20 text-xl mt-5">
    <li className="py-5 px-5 bg-slate-300 text-slate-600 rounded-xl"><Link href="/adminLogin">Admin Login</Link></li>
    <li className="py-5 px-5 bg-slate-300 text-slate-600 rounded-xl"><Link href="/Adminlogin">Cashier Login</Link></li>
    <li className="py-5 px-5 bg-slate-300 text-slate-600 rounded-xl"><Link href="/login">Custumer Login</Link></li>
  </ul>
  </div>
  );
}
