import './App.css';
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const TitleBar = (props) => {
  const [active, setActive] = useState(false)
  const [statsActive, setStatsActive] = useState(false)

  const activeHandler = () => {
    setStatsActive(!statsActive)
    props.statsHandler()
  }
  const selectHandler = (id) => {
    props.profileSwitchHandler(id)
    setActive(!active)
  }

  const closeHandler = () => {
    setActive(false)
  }

  return (
    <>
    <div className="h-[70px]">
      <div className="flex-col">
        <div className="font-albert-600 text-gray-800 font-medium text-5xl pb-[20px] flex items-end">
          Node<span className="text-green-600 whitespace-pre">Watts </span><span className='text-3xl mr-[20px]'>Visualizer</span>
          <span className="text-lg text-gray-700 whitespace-pre">Profile: {props.name}{"   "}</span>
          <div className="flex-col items-center">
            {!active && <Button title="Select Profile" active={true} buttonHandler={() => { setActive(!active) }} />}
          </div>
          {props.showStats && !active && (
            <div className="flex-col items-center">
              <button
                className=" h-full text-sm bg-gray-300 w-[150px] h-[30px] pt-[5px] pb-[5px] rounded-md"
                onClick={() => { activeHandler() }}
              >
                {statsActive ? "Close Stats" : "View Stats"}
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
    {props.options && active &&
      <div className='absolute w-full h-[calc(100vh-70px)] z-100 flex items-center bg-white justify-center'>
        <ProfileDropDown options={props.options} closeHandler={closeHandler} selectHandler={selectHandler} />
      </div>
    }
    </>
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
    <div className="flex-col">
      <div className="flex w-[600px]">
        <div className="font-bold font-ubuntu mb-[5px] ml-[5px]">Select a Profile:</div>
        <button 
          className="ml-[410px] font-bold rounded-md bg-green-200 mb-1 pr-1 pl-1 hover:bg-red-200 cursor-pointer"
          onClick={() => {props.closeHandler()}}
        >Close</button>
      </div>    
      <div className="w-[600px] h-[400px] rounded-md bg-gray-200 overflow-y-scroll">
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
    <div className="w-full h-[40px]">
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
  var styling
  if (props.active) {
    styling = "text-gray-800 font-ubuntu text-sm rounded-md w-[150px] h-[30px] mr-[10px] bg-green-300"
  } else {
    styling = "bg-gray-300 text-gray-800 text-sm font-ubuntu rounded-md w-[150px] h-[30px] mr-[10px] hover:bg-green-300"
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
  var styling = "border-b-2 border-gray-800 flex justify-center "
  return (
    <div className={styling} style={{ width: props.width + '%' }}>{props.name}</div>
  )
}

const HeaderBar = () => {
  return (
    <div className="w-full h-[5%] flex justify-start font-ubuntu">
      <ListHeader width={17} name="Function" />
      <ListHeader width={53} name="URL" />
      <ListHeader width={5} name="Line:Col" />
      <ListHeader width={6} name="Hit Count" />
      <ListHeader width={19} name="Average Power Consumtion (Watts)" />
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
    <div className="flex-col items-start h-[calc(100vh-130px)] w-full">
      {!props.categoryView && <HeaderBar />}

      <div className="h-[calc(95%-5px)] mt-[5px] overflow-y-scroll text-gray-800 font-ubuntu">
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
    <div className="h-[35px] w-full text-sm font-ubunutu flex justify-center border-b-2 border-gray-300">
      <div className="w-[17%] h-full flex items-center justify-center ">
        <span className="truncate">{props.data.call_frame.functionName ? props.data.call_frame.functionName : "(anonymous)"}</span>
      </div>
      <div className="w-[53%] h-full flex items-center justify-start">
        <span className="truncate">{props.data.call_frame.url ? props.data.call_frame.url : "N/A"}</span>
      </div>
      <div className="w-[5%] h-full flex items-center justify-center">
        <span className="truncate">
          {props.data.call_frame.lineNumber ?
            String(props.data.call_frame.lineNumber)
            + ":" + String(props.data.call_frame.columnNumber)
            : "N/A"}
        </span>
      </div>
      <div className="w-[6%] h-full flex items-center justify-center">
        <span className="truncate">
          {props.data.hit_count ? props.data.hit_count : "-"}
        </span>
      </div>
      <div className={"w-[19%] h-full flex items-center flex justify-center " + props.genColor(props.data.avg_watts, props.data.hit_count)}>
        <span className="truncate">
          {props.data.avg_watts ? parseFloat(props.data.avg_watts).toFixed(1) : (props.data.hit_count > 0 ? "Negligible" : "Not Measured")}
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

      { expanded && (
          <div className="pr-[10px] pl-[10px]">
              {props.data.nodes && <HeaderBar />}
              {expanded && props.data.nodes && props.data.nodes.map((data) => {
                  return <ListItem genColor={props.genColor} data={data} key={uuidv4()} />
              }
        )}
          </div>
        )}
    </div>
  )
}

const PageTop = (props) => {
  const [statsActive, setStatsActive] = useState(false)

  const statsHandler = ()=> {
    console.log("hit")
    setStatsActive(!statsActive)
  }

  return (
  <div className="flex-row w-full">
    <TitleBar name={props.name} profileSwitchHandler={props.profileSwitchHandler} options={props.options} showStats={props.showNav} stats={props.stats} statsHandler={statsHandler}/>
    { props.showNav && <NavBar sortModeHandler={props.sortModeHandler} buttonHandler={props.buttonHandler} sortState={props.sortState} activeView={props.activeView} />}
    {statsActive && <StatsView data={props.stats}/>}
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
        console.log(err)
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

  const genColorShade = (val, hc) => {
    var colors = {
      "darkGreen": "bg-[#44c240]",
      "medGreen": "bg-[#70bf6d]",
      "lightGreen": "bg-[#b5dbb4]",
      "lightRed": "bg-[#e09494]",
      "medRed": "bg-[#db6b6b]",
      "darkRed": "bg-[#d93b3b]"
    }

    if (val === estimateStats.mean) {
      return "bg-[#dbdbdb]"
    } else if (val === 0 && hc === 0) {
      return "bg-[#ffffff]"
    } else if (val === 0 ) {
      return colors["darkGreen"]
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
    <div className="h-full w-full pb-[50px] m-auto pt-[20px] pl-[20px] pr-[20px] overflow-hide flex-col" >
      <PageTop 
        stats={stats} 
        showNav={!!renderItems} 
        profileSwitchHandler={profileSwitchHandler}
        sortState={sortState}
        sortModeHandler={sortModeHandler}
        options={options}
        buttonHandler={viewHandler}
        activeView={activeView}
        name={name}
        />
      {renderItems && <ListView genColor={genColorShade} sort={sort} sortState={sortState} items={renderItems} categoryView={activeView === "NodeJS Internal" || activeView === "Node Modules"} />}
      {!renderItems && !optionsError && <span>Select a profile</span>}
      {optionsError && <span>Failed to fetch saved profiles. {errMsg}</span>}
      {!optionsError && profileError && <span>Failed to fetch the profile. {errMsg}</span>}
    </div>
  );
}



export default App;
