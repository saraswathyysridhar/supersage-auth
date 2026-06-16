import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Search, Plus } from "lucide-react";
import api from "../api";
import StatCard from "../components/StatCard";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const darkMode =
    localStorage.getItem("darkMode") === "true";

  const fetchMembers = () => {
    api
      .get("/members")
      .then((res) => setMembers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async () => {
    try {
      await api.post("/members", newMember);

      fetchMembers();

      setShowModal(false);

      setNewMember({
        name: "",
        email: "",
        status: "Active",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete member?"))
      return;

    try {
      await api.delete(`/members/${id}`);

      fetchMembers();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      member.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const activeMembers = members.filter(
    (m) => m.status === "Active"
  ).length;

  const inactiveMembers = members.filter(
    (m) => m.status !== "Active"
  ).length;

  return (
    <div
      className={`p-8 min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Members
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage all registered members
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} label="Total Members" value={members.length} />
        <StatCard icon={UserCheck} label="Active Members" value={activeMembers} />
        <StatCard icon={UserX} label="Inactive Members" value={inactiveMembers} />
      </div>

      {/* MEMBER DIRECTORY */}
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold">
            Member Directory
          </h2>

          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className={`w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-black"
              }`}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="py-2 text-gray-400 text-xs font-medium uppercase tracking-wide">
                Member
              </th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Email</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Status</th>
              <th className="text-gray-400 text-xs font-medium uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member._id}
                className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                      {member.name?.charAt(0)}
                    </div>

                    <span className="font-medium text-sm">
                      {member.name}
                    </span>
                  </div>
                </td>

                <td className="text-sm text-gray-500">{member.email}</td>

                <td>
                  <span
                    className={
                      member.status === "Active"
                        ? "bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium"
                        : "bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-medium"
                    }
                  >
                    {member.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() =>
                      deleteMember(member._id)
                    }
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredMembers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-gray-500"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MEMBER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Add Member
            </h2>

            <input
              placeholder="Name"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  name: e.target.value,
                })
              }
              className="w-full border border-gray-200 p-3 rounded-xl mb-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <input
              placeholder="Email"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  email: e.target.value,
                })
              }
              className="w-full border border-gray-200 p-3 rounded-xl mb-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={newMember.status}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  status: e.target.value,
                })
              }
              className="w-full border border-gray-200 p-3 rounded-xl mb-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={addMember}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;