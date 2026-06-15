import { useEffect, useState } from "react";
import api from "../api";

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
          : "bg-gray-100 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Members
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all registered members
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">
            Total Members
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {members.length}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">
            Active Members
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {activeMembers}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500">
            Inactive Members
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {inactiveMembers}
          </h2>
        </div>
      </div>

      {/* MEMBER DIRECTORY */}
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Member Directory
          </h2>

          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className={`border border-gray-300 rounded-xl px-4 py-2 w-72 ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
            }`}
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">
                Member
              </th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {member.name?.charAt(0)}
                    </div>

                    <span className="font-medium">
                      {member.name}
                    </span>
                  </div>
                </td>

                <td>{member.email}</td>

                <td>
                  <span
                    className={
                      member.status === "Active"
                        ? "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                        : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
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
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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
          <div className="bg-white p-6 rounded-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-black">
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
              className="w-full border p-3 rounded mb-3 text-black"
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
              className="w-full border p-3 rounded mb-3 text-black"
            />

            <select
              value={newMember.status}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  status: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-4 text-black"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={addMember}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="bg-gray-500 text-white px-4 py-2 rounded"
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