import { prisma } from "@/lib/prisma"; import { getServerSession } from "next-auth"; import { authOptions } from "@/lib/auth"; import { redirect } from "next/navigation"; import Link from "next/link";
export default async function AdminUnits(){ const s=await getServerSession(authOptions); if((s as any)?.role!=="ADMIN") redirect("/marketplace");
  const pending=await prisma.unit.findMany({ where:{status:"RESERVED_PENDING"}, include:{ project:true, quotes:{ include:{receipt:true}, orderBy:{createdAt:"desc"} } } });
  return (<main style={{maxWidth:1100, margin:"40px auto", padding:"0 16px"}}><h1>Reservas pendientes</h1>
    {pending.length===0 && <p>No hay pendientes.</p>}
    {pending.map(u=>{ const last=u.quotes.find(q=>q.receipt); return (
      <div key={u.id} style={{background:"#fff",border:"1px solid #e9eef5",borderRadius:12,padding:12,marginTop:12}}>
        <div><b>{u.project.name}</b> – Depto {u.code} · {u.currency} {u.price.toLocaleString("en-US")}</div>
        {last?.receipt && <div>Comprobante: <a href={`/api/receipt/${last.receipt.id}/file`} target="_blank">ver archivo</a></div>}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <form action={`/api/units/${u.id}/status?action=approve`} method="post"><button style={{border:"1px solid #111",borderRadius:8,padding:"6px 10px"}}>Aprobar</button></form>
          <form action={`/api/units/${u.id}/status?action=reject`} method="post"><button style={{border:"1px solid #111",borderRadius:8,padding:"6px 10px"}}>Rechazar</button></form>
          <form action={`/api/units/${u.id}/status?action=sold`} method="post"><button style={{border:"1px solid #111",borderRadius:8,padding:"6px 10px"}}>Marcar Vendido</button></form>
          <Link href={`/unit/${u.id}`} style={{border:"1px solid #111",borderRadius:8,padding:"6px 10px"}}>Ver unidad</Link>
        </div></div> )})}</main>); }
