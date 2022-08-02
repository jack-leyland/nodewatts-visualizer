import './App.css';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const TitleBar = (props) => {
  const [active, setActive] = useState(false)
  const [statsActive, setStatsActive] = useState(false)

  const selectHandler = (id) => {
    props.profileSwitchHandler(id)
    setActive(!active)
  }

  return (
    <div>
      <div className="flex-col">
        <div className="font-albert-600 text-gray-800 font-medium max-h-[20%] w-full m-auto text-5xl pb-[20px] flex items-end">
          Node<span className="text-green-600 whitespace-pre">Watts </span><span className='text-3xl mr-[20px]'>Visualizer</span>
          <span className="text-lg text-gray-700 whitespace-pre">Profile: {props.name}{"   "}</span>
          <Button title="Select Profile" active={true} buttonHandler={() => { setActive(!active) }} />
          {props.showStats && (
            <div className="flex-col items-center">
              <button
                className=" h-full text-sm bg-gray-300 w-[150px] h-[30px] pt-[5px] pb-[5px] rounded-md"
                onClick={() => { setStatsActive(!statsActive) }}
              >
                {statsActive ? "Close Stats" : "View Stats"}
              </button>
            </div>
          )}
        </div>
        {statsActive && <StatsView data={props.stats} />}
      </div>
      {props.options && active && <ProfileDropDown options={props.options} selectHandler={selectHandler} />}
    </div>
  )
}

const StatsView = (props) => {
  if (!props.data) { return }
  return (
    <div className="flex-col h-[130px] text-sm font-albert p-2 rounded-md mb-[10px]">
      <div className="mb-[5px]">All figures in microseconds</div>
      <div className="flex items-center justify-start">
        <div><span className="font-bold underline mr-[15px]">CPU Profile Time Deltas</span>
          <div><span className="font-bold">Average: </span>{parseFloat(props.data.cpu_deltas.avg).toFixed(0)}</div>
          <div><span className="font-bold">Max: </span>{props.data.cpu_deltas.max}</div>
          <div><span className="font-bold">Min: </span>{props.data.cpu_deltas.min}</div>
        </div>
        <div><span className="font-bold underline mr-[15px]">Power Profile Time Deltas</span>
          <div><span className="font-bold">Average: </span>{parseFloat(props.data.power_deltas.avg).toFixed(0)}</div>
          <div><span className="font-bold">Max: </span>{props.data.power_deltas.max}</div>
          <div><span className="font-bold">Min: </span>{props.data.power_deltas.min}</div>
        </div>
        <div><span className="font-bold underline mr-[15px]">Timestamp Closeness</span>
          <div><span className="font-bold">Average: </span>{parseFloat(props.data.assignments.avg_diff).toFixed(0)}</div>
          <div><span className="font-bold">Max: </span>{props.data.assignments.max_diff}</div>
          <div><span className="font-bold">Min: </span>{props.data.assignments.min_diff}</div>
        </div>
      </div>
    </div>
  )
}

const ProfileDropDown = (props) => {
  const [options, setOptions] = useState(null)

  useEffect(() => {
    props.options.forEach((item) => {
      item["key"] = uuidv4()
    })
    setOptions(props.options)
  }, [props.options])

  const clickHandler = (key) => {
    var id;
    options.forEach((item) => {
      if (item["key"] === key) { id = item["_id"] }
    })
    props.selectHandler(id)
  }

  return (
    <div className="w-[600px] h-[400px] rounded-md bg-gray-200 absolute left-[553px] overflow-y-scroll">
      {options && options.map((data) => {
        return (<div
          className="text-sm p-2 hover:bg-green-200 rounded-md cursor-pointer"
          key={data.key}
          onClick={() => clickHandler(data.key)}
        >
          {data.name}
        </div>)
      })}
    </div>
  )
}

const NavBar = (props) => {
  const [activeView, setActiveView] = useState("All")
  const [selectValue, setSelectValue] = useState("Hit Count")

  useEffect(() => {
    setActiveView(props.activeView)
  }, [props.activeView])

  const selectHandler = (val) => {
    setSelectValue(val)
    props.sortModeHandler(val)
  }

  return (
    <div className="w-full mb-[10px]">
      <Button
        title="All"
        buttonHandler={props.buttonHandler}
        active={activeView === "All"}
      />
      <Button title="User" buttonHandler={props.buttonHandler} active={activeView === "User"} />
      <Button title="Node Modules" buttonHandler={props.buttonHandler} active={activeView === "Node Modules"} />
      <Button title="NodeJS Internal" buttonHandler={props.buttonHandler} active={activeView === "NodeJS Internal"} />
      <Button title="Other" buttonHandler={props.buttonHandler} active={activeView === "Other"} />
      {/* <Button title="Graph View" buttonHandler={props.buttonHandler} active={activeView === "Graph View"}/> */}
      <label htmlFor="sort">Sort by:</label>
      <select className="ml-[5px] bg-green-300 p-1 rounded-md"
        name="sort"
        id="sort"
        value={selectValue}
        onChange={(event) => selectHandler(event.target.value)}
      >
        <option name="power">Power Consumption</option>
        <option name="hits">Hit Count</option>
      </select>
    </div>
  )
}

const Button = (props) => {
  if (props.active) {
    var styling = "text-gray-800 font-ubuntu text-sm rounded-md w-[150px] h-[30px] mr-[10px] bg-green-300"
  } else {
    var styling = "bg-gray-300 text-gray-800 text-sm font-ubuntu rounded-md w-[150px] h-[30px] mr-[10px] hover:bg-green-300"
  }
  return (
    <button
      className={styling}
      onClick={() => { props.buttonHandler(props.title) }}
    >
      {props.title}
    </button>
  )
}

const ListHeader = (props) => {
  var styling = "border-b-2 border-gray-800 mr-[10px] flex justify-start "
  return (
    <div className={styling} style={{ width: props.width + 'px' }}>{props.name}</div>
  )
}

const HeaderBar = () => {
  return (
    <div className="w-full h-[25px] flex justify-start mb-[10px] font-Ubuntu">
      <ListHeader width={400} name="Function" />
      <ListHeader width={800} name="URL" />
      <ListHeader width={110} name="Line:Column" />
      <ListHeader width={90} name="Hit Count" />
      <ListHeader width={300} name="Average Power Consumtion (Watts)" />
    </div>
  )
}

const ListView = (props) => {
  const [renderData, setRenderData] = useState([])
  const [activeDropdowns, setActiveDropdowns] = useState([])

  const activeHandler = (name) => {
    if (activeDropdowns.includes(name)) {
      var newArr = activeDropdowns;
      newArr.splice(activeDropdowns.indexOf(name), 1);
    } else {
      var newArr = activeDropdowns
      newArr.push(name)
    }
    setActiveDropdowns(newArr)
  }


  useEffect(() => {
    if (props.categoryView) {
      let names = []
      for (const [name, array] of Object.entries(props.items)) {
        names.push(name)
      }
      var data = names.map((name) => {
        return <CategoryDropdown active={activeDropdowns.includes(name)}
          activeHandler={activeHandler}
          sort={props.sort}
          sortState={props.sortState}
          genColor={props.genColor}
          name={name}
          avg={props.items[name].avg}
          data={props.items[name]}
          key={uuidv4()} />
      })
      setRenderData(data)
    }
  }, [props.items, props.sortState])



  return (
    <div className="flex-col items-start">
      {!props.categoryView && <HeaderBar />}

      <div className="h-[780px] w-full overflow-y-scroll text-gray-800 font-ubuntu">
        <div>
          {
            !props.categoryView && props.items && props.items.map((data) => {
              return <ListItem genColor={props.genColor} data={data} key={uuidv4()} />
            }
            )
          }
          {
            props.categoryView && renderData.map((elem) => { return elem })
          }
        </div>
      </div>
    </div>
  )
}

const ListItem = (props) => {
  return (
    <div className="h-[35px] w-full text-sm font-ubunutu flex justify-start border-b-2 border-gray-300">
      <div className="w-[400px] h-full flex items-center mr-[10px]">
        <span className="truncate">{props.data.call_frame.functionName ? props.data.call_frame.functionName : "(anonymous)"}</span>
      </div>
      <div className="w-[800px] h-full flex items-center mr-[10px]">
        <span className="truncate">{props.data.call_frame.url ? props.data.call_frame.url : "N/A"}</span>
      </div>
      <div className="w-[110px] h-full flex items-center mr-[10px]">
        <span className="truncate">
          {props.data.call_frame.lineNumber ?
            String(props.data.call_frame.lineNumber)
            + ":" + String(props.data.call_frame.columnNumber)
            : "N/A"}
        </span>
      </div>
      <div className="w-[90px] h-full flex items-center mr-[10px]">
        <span className="truncate">
          {props.data.hit_count ? props.data.hit_count : "-"}
        </span>
      </div>
      <div className={"w-[300px] h-full flex items-center mr-[10px] flex justify-center " + props.genColor(props.data.avg_watts)}>
        <span className="truncate">
          {props.data.avg_watts ? parseFloat(props.data.avg_watts).toFixed(1) : "Not Measured"}
        </span>
      </div>
    </div>
  )
}

const CategoryDropdown = (props) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (props.sort) {
      props.sort(props.data.nodes, props.sortState)
    }
  }, [props.sortState])

  useEffect(() => {
    if (props.active) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  },[props.active])

  return (
    <div>
      <div
        className={"w-full h-[40px] text-sm rounded-md border-2 border-b-gray-300 pl-[10px] flex items-center mb-[5px] hover:bg-gray-300 " + props.genColor(props.avg)}
        onClick={() => {
          setExpanded(!expanded);
          props.activeHandler(props.name);
        }}
      >
        <span className="font-bold">{props.name}</span>
        {<div className="ml-[10px] font-regular">{parseFloat(props.avg).toFixed(1)}W</div>}
      </div>
      {
        expanded && props.data.nodes && <HeaderBar />
      }
      {
        expanded && props.data.nodes && props.data.nodes.map((data) => {
          return <ListItem genColor={props.genColor} data={data} key={uuidv4()} />
        })
      }
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState("All")
  const [renderItems, setRenderItems] = useState(null)
  const [allNodes, setAllNodes] = useState(null)
  const [options, setOptions] = useState(null)
  const [name, setName] = useState("None Selected")
  const [optionsError, setOptionsError] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [profileError, setProfileError] = useState(false)
  const [stats, setStats] = useState(null)
  const [sortState, setSortState] = useState("Hit Count")
  const [estimateStats, setEstimateStats] = useState({})

  useEffect(() => {

    axios.get("http://localhost:8080/options")
      .then(res => {
        const data = res.data
        if (data.fail) {
          setOptionsError(true)
          setErrMsg(data.reason)
        } else {
          var opts = data.options.map((str) => {
            return JSON.parse(str)
          })
          setOptions(opts.reverse())
        }
      })
      .catch((err) => {
        setOptionsError(true)
        setErrMsg("Please ensure the Visualization server is running. Use the nodewatts --visualizer flag to run the server without profiling.")
      })
  }, [])

  const setupRenderState = (profile) => {

    const getCatAvg = (arr) => {
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i].avg_watts
      }
      return sum / arr.length
    }

    const renderArrays = {
      "User": [],
      "Other": [],
      "Node Modules": {},
      "NodeJS Internal": {}
    }
    renderArrays["All"] = Object.keys(profile.node_map).map(key => {
      return profile.node_map[key]
    })
    profile.categories.user.forEach((id, i) => {
      renderArrays["User"].push(profile.node_map[id])
    })
    profile.categories.system.forEach((id, i) => {
      renderArrays["Other"].push(profile.node_map[id])
    })

    for (const [name, array] of Object.entries(profile.categories.npm_packages)) {
      let nodes = array.map((id) => {
        return profile.node_map[id]
      })
      renderArrays["Node Modules"][name] = {
        "nodes": nodes,
        "avg": getCatAvg(nodes)
      }
    }
    for (const [name, array] of Object.entries(profile.categories.node_js)) {
      let nodes = array.map((id) => {
        return profile.node_map[id]
      })
      renderArrays["NodeJS Internal"][name] = {
        "nodes": nodes,
        "avg": getCatAvg(nodes)
      }
    }
    renderArrays["All"].sort((a, b) => {
      return b.hit_count - a.hit_count
    })

    const measured = renderArrays["All"].filter(node => node.power_measurements.length > 0)
    var sum = 0;
    var vals = []
    for (var i = 0; i < measured.length; i++) {
      sum += measured[i].avg_watts
      vals.push(measured[i].avg_watts)
    }
    vals = vals.filter((v) => {
      return v !== 0
    })

    var stats = {
      "mean": sum / measured.length,
      "max": Math.max(...vals),
      "min": Math.min(...vals)
    }

    setEstimateStats(stats)
    setSortState("Hit Count")
    setStats(profile.stats)
    setAllNodes(renderArrays)
    setRenderItems(renderArrays["All"])
    setName(profile.name)
    setActiveView("All")
  }

  const viewHandler = (view) => {
    setActiveView(view)
    if (view === "Graph View") {
      setRenderItems([])
    } else {
      if (view !== "NodeJS Internal" && view !== "Node Modules") {
        sort(allNodes[view], sortState)
      }
      setRenderItems(allNodes[view])
    }
  }

  const profileSwitchHandler = (id) => {
    axios.get("http://localhost:8080/profiles", { params: { profile: id } })
      .then(res => {
        if (res.fail) {
          setProfileError(true)
          setErrMsg(res.reason)
        } else {
          const profile = JSON.parse(res.data.profile)
          setupRenderState(profile)
        }
      })
      .catch((err) => {
        console.log(err)
        setProfileError(true)
        setErrMsg("Unexpected request error. Check server logs")
      })

  }

  const sort = (array, mode) => {
    if (mode === "Power Consumption") {
      array.sort((a, b) => {
        return b.avg_watts - a.avg_watts
      })
    } else if (mode === "Hit Count") {
      array.sort((a, b) => {
        return b.hit_count - a.hit_count
      })
    }
  }

  const sortModeHandler = (mode) => {
    if (activeView !== "Node Modules" && activeView !== "NodeJS Internal") {
      sort(renderItems, mode)
    }
    setSortState(mode)
  }

  const genColorShade = (val) => {
    if (val === estimateStats.mean) {
      return "bg-[#dbdbdb]"
    } else if (val === 0) {
      return "bg-[#ffffff]"
    }

    var colors = {
      "darkGreen": "bg-[#44c240]",
      "medGreen": "bg-[#70bf6d]",
      "lightGreen": "bg-[#b5dbb4]",
      "lightRed": "bg-[#e09494]",
      "medRed": "bg-[#db6b6b]",
      "darkRed": "bg-[#d93b3b]"
    }

    var overStep = Math.abs(estimateStats.max - estimateStats.mean) / 3
    var underStep = Math.abs(estimateStats.min - estimateStats.mean) / 3

    if (val > estimateStats.mean) {
      if (val > estimateStats.mean && val <= estimateStats.mean + overStep) {
        return colors["lightRed"]
      } else if (val > estimateStats.mean + overStep && val <= estimateStats.mean + (2 * overStep)) {
        return colors["medRed"]
      } else {
        return colors["darkRed"]
      }

    } else {

      if (val < estimateStats.mean && val >= estimateStats.mean - underStep) {
        return colors["lightGreen"]
      } else if (val < estimateStats.mean + overStep && val >= estimateStats.mean + (2 * underStep)) {
        return colors["medGreen"]
      } else {
        return colors["darkGreen"]
      }
    }

  }

  return (
    <div className="h-full pb-[50px] w-[1800px] m-auto pt-[20px] pl-[20px] overflow-hide" >
      <TitleBar name={name} profileSwitchHandler={profileSwitchHandler} options={options} showStats={renderItems} stats={stats} />
      {renderItems && <NavBar sortModeHandler={sortModeHandler} buttonHandler={viewHandler} sortState={sortState} activeView={activeView} />}
      {renderItems && <ListView genColor={genColorShade} sort={sort} sortState={sortState} items={renderItems} categoryView={activeView === "NodeJS Internal" || activeView === "Node Modules"} />}
      {!renderItems && !optionsError && <span>Select a profile</span>}
      {optionsError && <span>Failed to fetch saved profiles. {errMsg}</span>}
      {!optionsError && profileError && <span>Failed to fetch the profile. {errMsg}</span>}
    </div>
  );
}

export default App;
