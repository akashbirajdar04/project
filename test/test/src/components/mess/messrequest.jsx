import { useEffect, useState } from "react"
import api from "../../lib/api"
import { toast } from "sonner"
import { User, Check, X, Loader2, Inbox } from "lucide-react"

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
        // toast.error("Can't fetch the requests from database") // Optional: suppress error on init
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mess Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage incoming student requests</p>
      </div>

      {(!requests || requests.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No Pending Requests</h3>
          <p className="text-slate-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid gap-4">
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
              <div key={reqId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">
                      {u?.username || u?.email || "Unknown User"}
                    </h4>
                    {u?.email && <p className="text-slate-500 text-sm">{u.email}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onAccept}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={onReject}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 font-medium transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}