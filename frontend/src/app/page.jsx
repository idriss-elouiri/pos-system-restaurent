import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-[90px] text-slate-600">Restaurent Pos</h1>
      <ul className="flex justify-center items-center gap-20 text-xl mt-5">
        <li className="py-5 px-5 bg-slate-300 text-slate-600 rounded-xl">
          <Link href="/adminLogin">تسجيل المسوؤل </Link>
        </li>
        <li className="py-5 px-5 bg-slate-300 text-slate-600 rounded-xl">
          <Link href="/staffLogin">صفحة تسجيل العامل</Link>
        </li>
      </ul>
    </div>
  );
}
