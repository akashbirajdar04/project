import { useEffect, useState } from "react"
import api from "../../lib/api"
import { toast } from "sonner"
import { UserRound, Check, X } from "lucide-react"

export const Messrequest = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState({})
  const id = localStorage.getItem("Id")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/Profile/Messrequest/${id}`)
        setRequests(res.data?.data ?? [])
      } catch (err) {
        console.error(err)
        toast.error("Can't fetch the requests from database")
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!requests || requests.length === 0) return
        const res = await api.get(`/users/basic`, { params: { ids: requests.join(",") } })
        const map = {}
        for (const u of res.data?.data ?? []) map[u._id] = u
        setUsers(map)
      } catch (e) { console.error(e) }
    }
    fetchUsers()
  }, [requests])

  if (loading) return <div className="text-slate-500">Loading...</div>
  if (!requests || requests.length === 0)
    return (
      <div className="w-full">
        <div className="mb-5">
          <div className="text-slate-500 text-sm">Review and manage incoming requests</div>
          <h1 className="text-2xl font-bold text-slate-800">Student Requests</h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">📭</div>
          <div className="font-semibold text-slate-800">No requests yet</div>
          <p className="text-slate-500 text-sm mt-1">You'll see new student requests here as they arrive.</p>
        </div>
      </div>
    )

  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="text-slate-500 text-sm">Review and manage incoming requests</div>
        <h1 className="text-2xl font-bold text-slate-800">Student Requests</h1>
      </div>
      <div className="space-y-4">
      {requests.map((reqId) => {
        const onAccept = async () => {
          try {
            await api.post(`/Profile/Messrequest/${id}/accept`, { userId: reqId })
            setRequests((prev) => prev.filter((r) => String(r) !== String(reqId)))
            toast.success("Request accepted")
          } catch (e) {
            toast.error(e?.response?.data?.message || "Accept failed")
          }
        }

        const onReject = async () => {
          try {
            await api.post(`/Profile/Messrequest/${id}/reject`, { userId: reqId })
            setRequests((prev) => prev.filter((r) => String(r) !== String(reqId)))
            toast.success("Request rejected")
          } catch (e) {
            toast.error(e?.response?.data?.message || "Reject failed")
          }
        }

        const u = users[reqId]
        return (
          <div key={reqId} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <UserRound size={18} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-800">{u?.username || u?.email || reqId}</div>
                  {u?.email && <div className="text-sm text-slate-500">{u.email}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onAccept} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  <Check size={16} /> Accept
                </button>
                <button onClick={onReject} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600">
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}