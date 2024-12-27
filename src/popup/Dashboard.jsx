import React, { useEffect, useState } from "react";
export default function Dashboard({ page, setpage }) {
  const [latesttabs, setLatesttabs] = useState([]);
  const [title, setTitle] = useState("");
  const [titleAlert, setTitleAlert] = useState(false);
  const [loadfolders, setloadfolders] = useState(false);
  const [loadhistory, setloadhistory] = useState(false);
  const [history, sethistory] = useState([
    { tabid: 0, id: 0, title: "No History" },
  ]);
  const [dummyhistory, setdummyhistory] = useState([
    { tabid: 0, id: 0, title: "No History" },
  ]);
  const [showhistory, setshowhistory] = useState(false);
  const [loadcurrenttabs, setloadcurrenttabs] = useState(false);
  const [foldertabs, setfoldertabs] = useState([]);
  const [dummyfoldertabs, setdummyfoldertabs] = useState([]);
  const [loadfoldertabs, setloadfoldertabs] = useState(false);
  const [folders, setfolders] = useState([]);
  const [openfolder, setopenfolder] = useState(false);
  const [foldertitle, setfoldertitle] = useState("");
  const [detelehistory, setdeletehistory] = useState(0);
  const [refreshfolders, setrefreshfolders] = useState(false);
  const [saveFolder, setsaveFolder] = useState(false);
  const [deletinghistory, setdeletinghistory] = useState(false);
  const [deletingfoldertab, setdeletingfoldertab] = useState(false);
  const [historyref, sethistoryref] = useState(false);
  const [addingtofolder, setaddingtofolder] = useState(false);
  const [addingtofolderbackendcall, setaddingtofolderbackendcall] =
    useState(false);
  const [delFolder, setdelFolder] = useState(-1);
  const [arr, setArr] = useState([]);
  const [currentfolder, setcurrentfolder] = useState(-1);
  const [currentfoldername, setcurrentfoldername] = useState("");
  const [tryfoldel, settryfoldel] = useState(-1);
  useEffect(() => {
    const today = new Date().toISOString();
    chrome.tabs.query({}, (tabs) => {
      const tabData = tabs.map((tab) => ({
        url: tab.url,
        title: tab.title,
        tabid: tab.id,
        favIconUrl: tab.favIconUrl || " ",
        type: 1,
        date: today,
        checked: false,
      }));
      console.log(tabData);
      setLatesttabs(tabData);
    });
  }, []);

  function truncateTitle(title) {
    if (title.length > 40) {
      return title.substring(0, 40) + "...";
    } else {
      return title;
    }
  }

  useEffect(() => {
    setloadfolders(true);
    chrome.storage.local.get(["token69"], (result) => {
      if (result.token69) {
        const token = result.token69;
        console.log(token + " ");
        fetch(
          "https://extensionbackend.hamdidcarel.workers.dev/getmanfolders",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "hi" }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success == false) {
              //alert("Failed to save tabs")
            } else if (data.success == true) {
              setloadfolders(false);
              setfolders(data.folders);
              //console.log(folders);
              //alert("Tabs saved successfully")
            }
          })
          .catch((error) => {
            console.error("Error storing tabs in the backend:", error);
          });
      }
    });
  }, [refreshfolders]);

  useEffect(() => {
    setloadhistory(true);
    setdeletinghistory(true);
    chrome.storage.local.get(["token69"], (result) => {
      if (result.token69) {
        const token = result.token69;
        console.log(token + " ");
        fetch(
          "https://extensionbackend.hamdidcarel.workers.dev/getrecenthistory",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "hi" }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success == false) {
              //alert("Failed to save tabs")
            } else if (data.success == true) {
              setloadhistory(false);
              sethistory(data.tabs);
              setdeletinghistory(false);
              console.log(folders);
              //alert("Tabs fetched successfully")
            }
          })
          .catch((error) => {
            console.error("Error fetching tabs from backend", error);
          });
      }
    });
  }, [historyref]);
  const handleCloseTab = (tabId) => {
    setLatesttabs((prevTabs) => prevTabs.filter((tab) => tab.tabid !== tabId));
  };

  const handleClosefolderTab1 = (tabId) => {
    chrome.storage.local.get(["token69"], (result) => {
      if (result.token69) {
        const token = result.token69;
        console.log(token + " ");
        //setdeletingfoldertab(true);
        setdummyfoldertabs(foldertabs);
        setfoldertabs((prevFolderTabs) => prevFolderTabs.filter(t => t.id !== tabId));
        fetch("https://extensionbackend.hamdidcarel.workers.dev/deletemantab", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: tabId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === true) {
              sethistoryref((x) => !x);
            } else {
              alert("error deling tab");
            }
            setdeletingfoldertab(false);
            
            //sethistoryref(x=>!x);
          })
          .catch((error) => {
            setfoldertabs(dummyfoldertabs);
            console.error("Error in backend", error);
          });
      }
    });
    setLatesttabs((prevTabs) => prevTabs.filter((tab) => tab.tabid !== tabId));
  };
  const handleCloseTab1 = (tabId) => {
    chrome.storage.local.get(["token69"], (result) => {
      if (result.token69) {
        const token = result.token69;
        console.log(token + " ");
        //setdeletinghistory(true);
        setdummyhistory(history);
        sethistory((h) => h.filter(t => t.id !== tabId));
        fetch("https://extensionbackend.hamdidcarel.workers.dev/deletetab", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: tabId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === true) {
              //sethistoryref((x) => !x);
            } else {
              alert("error deling tab");
            }
            setdeletinghistory(false);
            setdeletehistory(0);
            //sethistoryref(x=>!x);
          })
          .catch((error) => {
            sethistory(dummyhistory);
            console.error("Error in backend", error);
          });
      }
    });
    setLatesttabs((prevTabs) => prevTabs.filter((tab) => tab.tabid !== tabId));
  };
  return (
    <div>
      <div>
        <div className="popup shadow-md rounded-lg overflow-hidden">
          <header className="flex justify-between items-center bg-gray-200 px-4 py-2">
            <h1 className="text-lg font-semibold">TabNest</h1>
            <button
              className="text-gray-500 hover:text-red-500 focus:outline-none"
              onClick={() => {
                chrome.storage.local.remove(["token69"], () => {
                  chrome.runtime.sendMessage({
                    action: "removeToken",
                    token69: "token69",
                  });
                  chrome.runtime.sendMessage({
                    action: "removesavedtabs",
                    laststore: "laststore",
                  });
                  console.log("authToken removed from local storage");
                });
                setpage("login");
              }}
            >
              Log Out
            </button>
          </header>
          <main className="px-4 py-3">
            <section className="mb-4">
              <div className="flex justify-between">
                <h2 className="font-semibold">Currently Open Tabs</h2>
                {!addingtofolder && (
                  <input
                    type="text"
                    onChange={(e) => {
                      setTitle(e.target.value);
                      console.log(title);
                      setTitleAlert(false);
                    }}
                    className={`mr-10 px-2  rounded-md shadow-sm border ${
                      titleAlert ? "border-red-600 " : "border-gray-300 "
                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Title"
                  ></input>
                )}
              </div>
              <ul className="tabs-list overflow-y-auto h-48 border rounded-md px-2">
                {/* Display currently opened tabs dynamically using your logic here */}
                {loadcurrenttabs && (
                  <li key="loading" className="text-gray-500">
                    Loading tabs...
                  </li>
                )}
                {!loadcurrenttabs &&
                  latesttabs.map((tab) => {
                    return (
                      <li
                        className="flex flex-col justify-center hover:bg-gray-300"
                        key={tab.tabid}
                      >
                        <div className="flex space-x-4 justify-items-center">
                          {!addingtofolder && (
                            <button
                              onClick={() => handleCloseTab(tab.tabid)}
                              className="mr-1 hover:fill-red-900"
                            >
                              <svg
                                class="mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="15"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1h5ZM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561l1.18 10.23ZM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 1 1 0V8Z" />
                              </svg>
                            </button>
                          )}
                          {addingtofolder && (
                            <div className="h-full">
                              <input
                                type="checkbox"
                                checked={tab.checked}
                                onChange={() => {
                                  console.log(tab.checked);
                                  const updateCheckedForId = (
                                    idToUpdate,
                                    val
                                  ) => {
                                    //console.log(val+"  "+idToUpdate);
                                    setLatesttabs((prevTabs) =>
                                      prevTabs.map((tab) =>
                                        tab.tabid === idToUpdate
                                          ? { ...tab, checked: val }
                                          : tab
                                      )
                                    );
                                  };
                                  updateCheckedForId(tab.tabid, !tab.checked);
                                  setArr((prevArr) => {
                                    const index = prevArr.findIndex(
                                      (item) => item.tabid === tab.tabid
                                    );

                                    if (index === -1) {
                                      return [...prevArr, tab];
                                    } else {
                                      // Object with the id is already in the array, remove it
                                      return prevArr.filter(
                                        (item) => item.tabid !== tab.tabid
                                      );
                                    }
                                  });
                                  console.log(arr);
                                }}
                                className={`form-checkbox h-3 w-3 text-blue-500 text-xs mr-3 my-auto`}
                              />
                            </div>
                          )}
                          {tab.favIconUrl != " " && (
                            <div className="mr-2 my-auto">
                              <img
                                className="h-4 w-4"
                                src={`${tab.favIconUrl}`}
                                alt="Favicon"
                              />
                            </div>
                          )}
                          {tab.favIconUrl === " " && (
                              <div className="mr-4 my-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.6 37.506a5.994 5.994 0 0 1-5.994 5.994c-1.975 0-3.711-.967-4.803-2.44C27.71 42.534 25.974 43.5 24 43.5s-3.71-.967-4.803-2.44c-1.092 1.473-2.828 2.44-4.802 2.44A5.994 5.994 0 0 1 8.4 37.506V20.1c0-8.616 6.985-15.6 15.6-15.6s15.6 6.984 15.6 15.6z"/><rect width="4.952" height="7.131" x="15.044" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><rect width="4.952" height="7.131" x="28.003" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 27.883a8.198 8.198 0 0 1-5.245-1.887c-1.173-.97-2.995-.163-2.996 1.36c0 .52.048 1.052.15 1.592c.611 3.251 3.22 5.881 6.471 6.5c5.263 1.002 9.861-3.006 9.861-8.087v-.042c-.007-1.506-1.833-2.286-2.993-1.325A8.198 8.198 0 0 1 24 27.884Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.243 32.096c2.604-1.415 8.19.186 9.514 3.033m1.105-8.208v2.171"/></svg>
                              </div>
                            )}
                          {/* {
                            addingtofolder&&<input type="checkbox" checked={arr.some((item) => item.tabid === tab.tabid)} onChange={()=>{
                              console.log(arr);
                                setArr(prevArr => {
                                  const index = prevArr.findIndex(item => item.tabid === tab.tabid);
                            
                                  if (index === -1) {
    
                                    return [...prevArr, tab];
                                  } else {
                                    // Object with the id is already in the array, remove it
                                    return prevArr.filter(item => item.tabid !== tab.tabid);
                                  }
                                });
                              
                            }} className={`appearance-none w-6 h-6 border-2 rounded ${ (arr.some(item => item.id === tab.id))? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} checked:bg-blue-500 checked:border-blue-500`}
                            />
                          } */}
                          <span className="mb-1 text-xs">
                            {truncateTitle(tab.title)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <button
                disabled={saveFolder || addingtofolderbackendcall}
                onClick={async () => {
                  if (addingtofolder) {
                    setaddingtofolderbackendcall(true);
                    chrome.storage.local.get(["token69"], (result) => {
                      if (result.token69) {
                        const token = result.token69;
                        console.log(token + " ");
                        fetch(
                          "https://extensionbackend.hamdidcarel.workers.dev/addmantabs",
                          {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              tabs: arr,
                              currentfolder: currentfolder,
                            }),
                          }
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            if (data.success === true) {
                              //setrefreshfolders((x) => !x);
                              setopenfolder(false);
                            } else {
                              //alert("Tabs saved successfully");
                              alert("Failed to save tabs");
                            }

                            setaddingtofolderbackendcall(false);
                            setaddingtofolder(false);
                          })
                          .catch((error) => {
                            console.error(
                              "Error storing tabs in the backend:",
                              error
                            );
                          });
                      }
                    });
                  } else {
                    if (title == "") {
                      setTitleAlert(true);
                      alert("please give a Title");
                    } else {
                      setsaveFolder(true);
                      chrome.storage.local.get(["token69"], (result) => {
                        if (result.token69) {
                          console.log(latesttabs);

                          console.log(latesttabs[0]);
                          console.log(latesttabs[1]);
                          console.log(latesttabs[2]);
                          const token = result.token69;
                          console.log(token + " ");
                          fetch(
                            "https://extensionbackend.hamdidcarel.workers.dev/savemantabs",
                            {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                tabs: latesttabs,
                                title: title,
                              }),
                            }
                          )
                            .then((response) => response.json())
                            .then((data) => {
                              if (data.success === true) {
                                setrefreshfolders((x) => !x);
                              } else {
                                //alert("Tabs saved successfully");
                                alert("Failed to save tabs");
                              }
                              setsaveFolder(false);
                            })
                            .catch((error) => {
                              console.error(
                                "Error storing tabs in the backend:",
                                error
                              );
                            });
                        }
                      });
                    }
                  }
                }}
                className={`w-full mt-0.5 py-2 ${
                  saveFolder || addingtofolderbackendcall
                    ? "bg-blue-200"
                    : "bg-blue-500"
                } ${
                  saveFolder || addingtofolderbackendcall
                    ? "hover:bg-blue-200"
                    : "hover:bg-blue-700"
                }  text-white rounded-md  focus:outline-none`}
              >
                {!saveFolder &&
                  !addingtofolder &&
                  "Save Current Tabs as Record"}
                {saveFolder && !addingtofolder && "Saving..."}
                {addingtofolder &&
                  !addingtofolderbackendcall &&
                  `Add selected tabs to ${currentfoldername}`}
                {addingtofolder &&
                  addingtofolderbackendcall &&
                  `Adding to ${currentfoldername}..`}
              </button>
            </section>
            <section className="mb-4">
              <div className="flex">
                <h2
                  onClick={() => {
                    setshowhistory(false);
                    setopenfolder(false);
                  }}
                  className={`rounded-md px-2  font-semibold cursor-pointer ${
                    showhistory ? "bg-white" : "bg-slate-300 mr-5"
                  }`}
                >
                  Past Records
                </h2>
                <h2
                  onClick={() => {
                    setshowhistory(true);
                    setopenfolder(false);
                  }}
                  className={`rounded-md px-2 font-semibold cursor-pointer ${
                    showhistory ? "bg-slate-300" : "bg-white"
                  }`}
                >
                  History
                </h2>
              </div>
              {!showhistory && !openfolder && (
                <ul className="saved-windows-list overflow-y-auto h-48 border rounded-md px-2 py-1">
                  {/* Display past saved windows dynamically using your logic here */}
                  {loadfolders === true && (
                    <li key="loading" className="text-gray-500">
                      Loading saved windows...
                    </li>
                  )}
                  {!loadfolders &&
                    folders.map((tab) => {
                      const createdAtDate = new Date(tab.created_at);
                      const formattedDate = `${createdAtDate.getDate()}/${
                        createdAtDate.getMonth() + 1
                      }/${createdAtDate.getFullYear()}`;
                      return (
                        <li>
                          {tryfoldel === tab.id && (
                            <li
                              className="flex flex-col justify-center hover:bg-gray-300 p-2 rounded-md shadow-2xl cursor-pointer"
                              key={tab.id}
                            >
                              <div className="flex justify-betwwen flex-1 w-full">
                                <div className="mb-1 text-xs font-semibold mr-10">
                                  Delete {tab.title}
                                  {" ?  "}
                                </div>
                                <div className="mb-1 text-xs">
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      settryfoldel(-1);
                                      setdelFolder(tab.id);
                                      chrome.storage.local.get(
                                        ["token69"],
                                        (result) => {
                                          if (result.token69) {
                                            const token = result.token69;
                                            console.log(token + " ");
                                            fetch(
                                              "https://extensionbackend.hamdidcarel.workers.dev/deletefolder",
                                              {
                                                method: "POST",
                                                headers: {
                                                  Authorization: `Bearer ${token}`,
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                                body: JSON.stringify({
                                                  folder_id: tab.id,
                                                }),
                                              }
                                            )
                                              .then((response) =>
                                                response.json()
                                              )
                                              .then((data) => {
                                                if (data.success == false) {
                                                  alert(
                                                    "Failed to delete history"
                                                  );
                                                } else {
                                                  setrefreshfolders((x) => !x);
                                                  //alert("folder deleted");
                                                }
                                                setdelFolder(-1);
                                              })
                                              .catch((error) => {
                                                console.error(
                                                  "Error in backend",
                                                  error
                                                );
                                              });
                                          }
                                        }
                                      );
                                    }}
                                    className="underline text-blue-600 cursor-pointer mr-5"
                                  >
                                    {"Yes"}
                                    {/* {setdelFolder!=tab.id &&"Yes"} */}
                                  </span>
                                  <span
                                    onClick={() => {
                                      settryfoldel(-1);
                                    }}
                                    className="underline text-blue-600 cursor-pointer"
                                  >
                                    No
                                  </span>
                                </div>
                              </div>
                            </li>
                          )}
                          {tryfoldel != tab.id && (
                            <li
                              onClick={() => {
                                setopenfolder(true);
                                setloadfoldertabs(true);
                                setfoldertitle(tab.title);
                                setcurrentfolder(tab.id);
                                setcurrentfoldername(tab.title);
                                chrome.storage.local.get(
                                  ["token69"],
                                  (result) => {
                                    if (result.token69) {
                                      const token = result.token69;
                                      console.log(token + " ");
                                      fetch(
                                        "https://extensionbackend.hamdidcarel.workers.dev/getmantabs",
                                        {
                                          method: "POST",
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            folder_id: tab.id,
                                          }),
                                        }
                                      )
                                        .then((response) => response.json())
                                        .then((data) => {
                                          if (data.success == false) {
                                            //alert("Failed to save tabs")
                                          } else if (data.success == true) {
                                            setloadfoldertabs(false);
                                            setfoldertabs(data.tabs);
                                            console.log(foldertabs);

                                            chrome.runtime.sendMessage({
                                              action: "addtabs",
                                              newtabs: data.tabs,
                                            });

                                            //console.log("authToken removed from local storage");

                                            //alert("Tabs fetched successfully")
                                          }
                                        })
                                        .catch((error) => {
                                          console.error(
                                            "Error fetching tabs from backend",
                                            error
                                          );
                                        });
                                    }
                                  }
                                );
                              }}
                              className="flex flex-col justify-center hover:bg-gray-300 p-2 rounded-md shadow-2xl cursor-pointer"
                              key={tab.id}
                            >
                              <div className="flex justify-items-center">
                                <button>
                                  <div className="hover:fill-red-800">
                                    {delFolder != tab.id && (
                                      <svg
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          settryfoldel(tab.id);
                                        }}
                                        // onClick={(e) => {
                                        //   e.stopPropagation();
                                        //   setdelFolder(tab.id);
                                        //   chrome.storage.local.get(
                                        //     ["token69"],
                                        //     (result) => {
                                        //       if (result.token69) {
                                        //         const token = result.token69;
                                        //         console.log(token + " ");
                                        //         fetch(
                                        //           "https://extensionbackend.hamdidcarel.workers.dev/deletefolder",
                                        //           {
                                        //             method: "POST",
                                        //             headers: {
                                        //               Authorization: `Bearer ${token}`,
                                        //               "Content-Type":
                                        //                 "application/json",
                                        //             },
                                        //             body: JSON.stringify({
                                        //               folder_id: tab.id,
                                        //             }),
                                        //           }
                                        //         )
                                        //           .then((response) =>
                                        //             response.json()
                                        //           )
                                        //           .then((data) => {
                                        //             if (data.success == false) {
                                        //               alert(
                                        //                 "Failed to delete history"
                                        //               );
                                        //             } else {
                                        //               setrefreshfolders((x) => !x);
                                        //               //alert("folder deleted");
                                        //             }
                                        //             setdelFolder(-1);
                                        //           })
                                        //           .catch((error) => {
                                        //             console.error(
                                        //               "Error in backend",
                                        //               error
                                        //             );
                                        //           });
                                        //       }
                                        //     }
                                        //   );
                                        // }}
                                        className="mr-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13"
                                        height="15"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1h5ZM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561l1.18 10.23ZM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 1 1 0V8Z" />
                                      </svg>
                                    )}
                                    {delFolder === tab.id && (
                                      <div className="mr-5">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="15"
                                          height="15"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                            opacity=".5"
                                          />
                                          <path
                                            fill="currentColor"
                                            d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
                                          >
                                            <animateTransform
                                              attributeName="transform"
                                              dur="1s"
                                              from="0 12 12"
                                              repeatCount="indefinite"
                                              to="360 12 12"
                                              type="rotate"
                                            />
                                          </path>
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                                <div className="flex justify-betwwen flex-1 w-full">
                                  <div className="mb-1 text-xs font-semibold mr-10">
                                    {tab.title}
                                  </div>
                                  <div className="mb-1 text-xs">
                                    {formattedDate}
                                  </div>
                                </div>
                              </div>
                            </li>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}

              {!showhistory && openfolder && (
                <ul className="saved-windows-list overflow-y-auto h-48 border rounded-md px-2 py-1">
                  {/* Display past saved windows dynamically using your logic here */}
                  {loadfoldertabs === true && (
                    <li key="loading" className="text-gray-500">
                      Loading saved windows...
                    </li>
                  )}
                  {!loadfoldertabs && foldertabs.length > 0 && (
                    <li className="flex">
                      {" "}
                      <div
                        onClick={() => {
                          setaddingtofolder((x) => !x);
                        }}
                        className="cursor-pointer pt-2 bg-green-300 px-3 hover:bg-green-400 fill-black rounded-md"
                      >
                        {!addingtofolder && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7ZM8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Z" />
                            <path
                              fill="currentColor"
                              d="M8 11.5c-.28 0-.5-.22-.5-.5V5c0-.28.22-.5.5-.5s.5.22.5.5v6c0 .28-.22.5-.5.5Z"
                            />
                            <path
                              fill="currentColor"
                              d="M11 8.5H5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h6c.28 0 .5.22.5.5s-.22.5-.5.5Z"
                            />
                          </svg>
                        )}
                        {addingtofolder && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                              clip-rule="evenodd"
                            />
                            <path
                              fill="currentColor"
                              d="M11.854 4.854a.5.5 0 0 0-.707-.707L8 7.293L4.854 4.147a.5.5 0 1 0-.707.707L7.293 8l-3.146 3.146a.5.5 0 0 0 .707.708L8 8.707l3.147 3.147a.5.5 0 0 0 .707-.708L8.708 8z"
                            />
                          </svg>
                        )}
                      </div>
                      <div
                        onClick={() => {
                          if (!addingtofolder) {
                            const urls = foldertabs.map((tab) => tab.url); // Extract URLs from history array

                            chrome.windows.create(
                              {
                                url: urls,
                                focused: true,
                              },
                              (newWindow) => {
                                console.log(
                                  "New window created with tabs:",
                                  urls
                                );
                              }
                            );
                          }
                        }}
                        className={`flex-1 flex flex-col justify-center hover:bg-gray-300 p-2 rounded-md shadow-2xl text-blue-600 ${
                          addingtofolder ? "" : "cursor-pointer"
                        } `}
                      >
                        {!addingtofolder &&
                          "Click to open all tabs in new Window"}
                        {addingtofolder && "Add from currently open tabs above"}
                      </div>
                    </li>
                  )}
                  {!loadfoldertabs &&
                    foldertabs.map((tab) => {
                      return (
                        <li
                          className="flex flex-col justify-center hover:bg-gray-300 p-2 rounded-md shadow-2xl cursor-pointer"
                          key={tab.id}
                        >
                          <div className="flex h-full">
                            <button
                              onClick={() => {
                                const taburl = tab.url;
                                chrome.tabs.create({ url: taburl });
                              }}
                              className="mr-1 hover:fill-blue-600"
                            >
                              <svg
                                className="mr-5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h4.5a.5.5 0 0 0 0-1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5a.5.5 0 0 0 1 0V6a3 3 0 0 0-3-3H6Zm2.146 5.146A.5.5 0 0 1 8.506 8H13.5a.5.5 0 0 1 0 1H9.707l6.147 6.146a.5.5 0 0 1-.708.708L9 9.707V13.5a.5.5 0 1 1-1 0V8.494a.5.5 0 0 1 .146-.348Z" />
                              </svg>
                            </button>
                            {tab.favIconUrl != " " && (
                              <div className="mr-4 my-auto">
                                <img
                                  className="h-4 w-4"
                                  src={`${tab.favIconUrl}`}
                                  alt="Favicon"
                                />
                              </div>
                            )}
                            {tab.favIconUrl === " " && (
                              <div className="mr-4 my-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.6 37.506a5.994 5.994 0 0 1-5.994 5.994c-1.975 0-3.711-.967-4.803-2.44C27.71 42.534 25.974 43.5 24 43.5s-3.71-.967-4.803-2.44c-1.092 1.473-2.828 2.44-4.802 2.44A5.994 5.994 0 0 1 8.4 37.506V20.1c0-8.616 6.985-15.6 15.6-15.6s15.6 6.984 15.6 15.6z"/><rect width="4.952" height="7.131" x="15.044" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><rect width="4.952" height="7.131" x="28.003" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 27.883a8.198 8.198 0 0 1-5.245-1.887c-1.173-.97-2.995-.163-2.996 1.36c0 .52.048 1.052.15 1.592c.611 3.251 3.22 5.881 6.471 6.5c5.263 1.002 9.861-3.006 9.861-8.087v-.042c-.007-1.506-1.833-2.286-2.993-1.325A8.198 8.198 0 0 1 24 27.884Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.243 32.096c2.604-1.415 8.19.186 9.514 3.033m1.105-8.208v2.171"/></svg>
                              </div>
                            )}
                            <div className="flex justify-betwwen flex-1 w-full">
                              <div className="mb-1 text-xs font-semibold mr-10">
                                {tab.title}
                              </div>
                            </div>
                            <button
                              onClick={() => handleClosefolderTab1(tab.id)}
                              className=" hover:fill-red-700"
                            >
                              {!deletingfoldertab && (
                                <svg
                                  className="mr-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="13"
                                  height="15"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1h5ZM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561l1.18 10.23ZM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 1 1 0V8Z" />
                                </svg>
                              )}
                              {deletingfoldertab && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                    opacity=".5"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
                                  >
                                    <animateTransform
                                      attributeName="transform"
                                      dur="1s"
                                      from="0 12 12"
                                      repeatCount="indefinite"
                                      to="360 12 12"
                                      type="rotate"
                                    />
                                  </path>
                                </svg>
                              )}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
              {showhistory && (
                <ul className="saved-windows-list overflow-y-auto h-48 border rounded-md px-2 py-1">
                  
                  {loadhistory === true && (
                    <li key="loading" className="text-gray-500">
                      Loading History...
                    </li>
                  )}

                  {!loadfolders &&
                    history.map((tab) => {
                      return (
                        <li
                          className="flex flex-col justify-center hover:bg-gray-300 p-2 rounded-md shadow-2xl cursor-pointer"
                          key={tab.id}
                        >
                          <div className="flex justify-items-center">
                            <button
                              onClick={() => {
                                const taburl = tab.url;
                                chrome.tabs.create({ url: taburl });
                              }}
                              className="mr-1 hover:fill-blue-600"
                            >
                              {/* <svg
                              className="mr-5"
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="15"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1h5ZM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561l1.18 10.23ZM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 1 1 0V8Z" />
                            </svg> */}
                              <svg
                                className="mr-5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h4.5a.5.5 0 0 0 0-1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5a.5.5 0 0 0 1 0V6a3 3 0 0 0-3-3H6Zm2.146 5.146A.5.5 0 0 1 8.506 8H13.5a.5.5 0 0 1 0 1H9.707l6.147 6.146a.5.5 0 0 1-.708.708L9 9.707V13.5a.5.5 0 1 1-1 0V8.494a.5.5 0 0 1 .146-.348Z" />
                              </svg>
                            </button>
                            {tab.favIconUrl != " " && (
                            <div className="mr-2 my-auto">
                              <img
                                className="h-4 w-4"
                                src={`${tab.favIconUrl}`}
                                alt="Favicon"
                              />
                            </div>
                          )}
                          {tab.favIconUrl === " " && (
                              <div className="mr-4 my-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M39.6 37.506a5.994 5.994 0 0 1-5.994 5.994c-1.975 0-3.711-.967-4.803-2.44C27.71 42.534 25.974 43.5 24 43.5s-3.71-.967-4.803-2.44c-1.092 1.473-2.828 2.44-4.802 2.44A5.994 5.994 0 0 1 8.4 37.506V20.1c0-8.616 6.985-15.6 15.6-15.6s15.6 6.984 15.6 15.6z"/><rect width="4.952" height="7.131" x="15.044" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><rect width="4.952" height="7.131" x="28.003" y="15.581" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="2.476" ry="2.476"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 27.883a8.198 8.198 0 0 1-5.245-1.887c-1.173-.97-2.995-.163-2.996 1.36c0 .52.048 1.052.15 1.592c.611 3.251 3.22 5.881 6.471 6.5c5.263 1.002 9.861-3.006 9.861-8.087v-.042c-.007-1.506-1.833-2.286-2.993-1.325A8.198 8.198 0 0 1 24 27.884Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.243 32.096c2.604-1.415 8.19.186 9.514 3.033m1.105-8.208v2.171"/></svg>
                              </div>
                            )}
                            <div className="flex justify-betwwen flex-1 w-full">
                              <div className="mb-1 text-xs font-semibold mr-10">
                                {/* {tab.title} */}
                                {truncateTitle(tab.title)}
                              </div>
                            </div>
                            <button
                              onClick={() => handleCloseTab1(tab.id)}
                              className=" hover:fill-red-700"
                            >
                              {!deletinghistory && history[0].tabid != 0 && (
                                <svg
                                  className="mr-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="13"
                                  height="15"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1h5ZM5.741 15.23A2 2 0 0 0 7.728 17h4.544a2 2 0 0 0 1.987-1.77L15.439 5H4.561l1.18 10.23ZM8.5 7.5A.5.5 0 0 1 9 8v6a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 1 1 0V8Z" />
                                </svg>
                              )}
                              {deletinghistory && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                    opacity=".5"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
                                  >
                                    <animateTransform
                                      attributeName="transform"
                                      dur="1s"
                                      from="0 12 12"
                                      repeatCount="indefinite"
                                      to="360 12 12"
                                      type="rotate"
                                    />
                                  </path>
                                </svg>
                              )}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
              <div className="flex justify-between items-center">
                {showhistory && detelehistory === 0 && (
                  <button
                    onClick={() => {
                      setdeletehistory(1);
                    }}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    {"Clear All History"}
                  </button>
                )}

                {showhistory && detelehistory === 1 && (
                  <div className="text-red-500 hover:text-red-700 focus:outline-none">
                    <span className="text-sm">
                      Are you Sure? This will delete all the tabs history but
                      not Records{" "}
                    </span>{" "}
                    <span>
                      <button
                        onClick={() => {
                          chrome.storage.local.get(["token69"], (result) => {
                            if (result.token69) {
                              const token = result.token69;
                              //console.log(token + " ");
                              setdeletinghistory(true);
                              fetch(
                                "https://extensionbackend.hamdidcarel.workers.dev/deletehistory",
                                {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    deletehistory: true,
                                  }),
                                }
                              )
                                .then((response) => response.json())
                                .then((data) => {
                                  if (data.success == false) {
                                    alert("Failed to delete history");
                                  } else {
                                    //alert("History deleted");
                                    sethistory([
                                      { tabid: 0, id: 0, title: "No History" },
                                    ]);
                                    chrome.runtime.sendMessage({
                                      action: "deleteHistory",
                                      laststore: "laststore",
                                    });
                                  }
                                  setdeletehistory(0);
                                  setdeletinghistory(false);
                                })
                                .catch((error) => {
                                  console.error("Error in backend", error);
                                });
                            }
                          });
                        }}
                        className="text-blue-600 mr-5 underline"
                      >
                        {" "}
                        Yes{" "}
                      </button>{" "}
                      <button
                        onClick={() => {
                          setdeletehistory(0);
                        }}
                        className="text-blue-600 mr-5"
                      >
                        {" "}
                        No{" "}
                      </button>
                    </span>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
        {/* <div className="flex justify-between">
          <div>Tabs Dashboard</div>
          <button
            onClick={() => {
              chrome.storage.local.remove(["token69"], () => {
                chrome.runtime.sendMessage({
                  action: "removeToken",
                  token69: "token69",
                });
                chrome.runtime.sendMessage({
                  action: "removesavedtabs",
                  laststore: "laststore",
                });
                console.log("authToken removed from local storage");
              });
              setpage("login");
            }}
          >
            log out
          </button>
        </div> */}
      </div>
    </div>
  );
}
