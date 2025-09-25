import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createChat } from "../features/chatsSlice";
import { addUser } from "../features/usersSlice";
// import { addChatAsUser } from "../features/usersSlice";

function GroupChatForm({ click }) {
  const dispatch = useDispatch();
  const { setClicked } = click;
  const { users, currentUser } = useSelector((state) => state.users);

  const [selectedMembers, setSelectedMembers] = useState([currentUser]);

  const toggleMember = (uid) => {
    // Prevent removing current user
    if (uid === currentUser.uid) return;

    setSelectedMembers((prev) => prev.filter((u) => u.uid !== uid));
  };

  const handleSelect = (e) => {
    const uid = e.target.value;
    const user = users.find((u) => u.uid === uid);
    if (user && !selectedMembers.find((u) => u.uid === uid)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    e.target.value = ""; // reset select to placeholder
  };

  const validationSchema = Yup.object({
    groupName: Yup.string().required("Group name is required"),
    groupPhoto: Yup.string().url("Enter a valid URL"),
  });

  function randomId(len = 25) {
    return Array.from(crypto.getRandomValues(new Uint8Array(len)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, len);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 hover:text-gray-600"
          onClick={() => setClicked(false)}
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Group Chat
        </h2>

        <Formik
          initialValues={{
            groupName: "",
            groupPhoto: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const members = selectedMembers.map((el) => el.uid);

            dispatch(addUser({
              uid: randomId(),
              displayName: values.groupName,
              email: currentUser.email,
              photoURL: values.groupPhoto
            }));

            dispatch(
              createChat({
                type: "group",
                members,
                groupName: values.groupName,
                groupPhotoURL: values.groupPhoto,
              })
            );

            setClicked(false);
          }}
        >
          {() => (
            <Form className="space-y-4">
              {/* Group Name */}
              <div>
                <label className="block mb-1 font-medium">Group Name</label>
                <Field
                  name="groupName"
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="groupName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Group Photo */}
              <div>
                <label className="block mb-1 font-medium">Group Photo URL</label>
                <Field
                  name="groupPhoto"
                  placeholder="Enter image URL"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="groupPhoto"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Members Multi-Select */}
              <div>
                <label className="block mb-1 font-medium">Add Members</label>

                {/* Selected members tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMembers.map((user) => (
                    <span
                      key={user.uid}
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {user.displayName}
                      {user.uid !== currentUser.uid && (
                        <button
                          type="button"
                          onClick={() => toggleMember(user.uid)}
                          className="text-blue-600 hover:text-blue-900 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Select field */}
                <select
                  className="w-full border rounded-md p-2"
                  onChange={handleSelect}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select members
                  </option>
                  {users
                    .filter((u) => !selectedMembers.find((m) => m.uid === u.uid))
                    .map((user) => (
                      <option key={user.uid} value={user.uid}>
                        {user.displayName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Group
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default GroupChatForm;
