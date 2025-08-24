
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const [passwordArray, setPasswordArray] = useState([]);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const passwordRef = useRef();
  const eyeRef = useRef();

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:4000/passwords";

  const getPasswords = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: token }
      });
      if (res.status === 401) {
        toast.error("Unauthorized! Please log in.");
        return;
      }
      const data = await res.json();
      setPasswordArray(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch passwords");
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    if (eyeRef.current.src.includes("icons/eyecross.png")) {
      eyeRef.current.src = "icons/eye.png";
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
      eyeRef.current.src = "icons/eyecross.png";
    }
  };

  const savePassword = async () => {
    const { site, username, password } = form;
    if (site.length > 3 && username.length > 3 && password.length > 3) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({ site, username, password })
        });
        const data = await res.json();
        if (data.success) {
          setPasswordArray([...passwordArray, data.data]);
          setForm({ site: "", username: "", password: "" });
          toast.success("Password saved successfully");
        } else {
          toast.error("Failed to save password");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error saving password");
      }
    } else {
      toast.error("Please fill all fields correctly");
    }
  };

  const editPassword=(item)=>{
     deletePassword(item._id);
     setForm({ site: item.site, username: item.username, password: item.password });
  }

  const deletePassword = async (id) => {

      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: token }
        });
        setPasswordArray(passwordArray.filter((item) => item._id !== id));
        toast.success("Password deleted");
      } catch (err) {
        console.error(err);
        toast.error("Error deleting password");
      }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} transition={Bounce} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="p-3 md:mycontainer min-h-[88.3vh]">
        <h1 className="text-3xl font-bold text-center">
          <span className="text-green-500">&lt;</span>Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>
        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={eyeRef}
                  className="p-1"
                  width={26}
                  src="icons/eye.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <a href={item.site} target="_blank">{item.site}</a>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => copyText(item.site)}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px"
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <span>{item.username}</span>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => copyText(item.username)}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px"
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <span>{"*".repeat(item.password.length)}</span>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => copyText(item.password)}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px"
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="justify-center py-2 border border-white text-center">
                      <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon>
                                        </span>

                      <span
                        className="cursor-pointer mx-1"
                        onClick={() => deletePassword(item._id)}
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
