import './App.css';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const Title = (props) => {
  return(
    <div className="font-albert-600 text-gray-800 font-medium h-[20%] w-full m-auto text-5xl pb-[20px]">
      Node<span className="text-green-600">Watts</span> <span className='text-3xl mr-[20px]'>Visualizer</span>
      <span className="text-lg text-gray-700">Profile: {props.name}</span>
    </div>
  )
}

const NavBar = (props) => {
  const [activeView, setActiveView] = useState("All")
  useEffect(()=> {
    setActiveView(props.activeView)
  },[props.activeView])
  return (
    <div className="w-full mb-[10px]">
      <Button 
        title="All"
        buttonHandler={props.buttonHandler}
        active={activeView === "All"}
      />
      <Button title="User" buttonHandler={props.buttonHandler} active={activeView === "User"}/>
      <Button title="Node Modules" buttonHandler={props.buttonHandler} active={activeView === "Node Modules"}/>
      <Button title="NodeJS Internal" buttonHandler={props.buttonHandler} active={activeView === "NodeJS Internal"}/>
      <Button title="Other" buttonHandler={props.buttonHandler} active={activeView === "Other"}/>
      <Button title="Graph View" buttonHandler={props.buttonHandler} active={activeView === "Graph View"}/>
    </div>
  )
}

const Button = (props) => {
  if (props.active){
    var styling = "text-gray-800 font-ubuntu rounded-md w-[150px] h-[30px] mr-[10px] bg-green-300"
  } else {
    var styling = "bg-gray-300 text-gray-800 font-ubuntu rounded-md w-[150px] h-[30px] mr-[10px] hover:bg-green-300"
  }
  return(
    <button 
    className={styling}
    onClick={()=>{props.buttonHandler(props.title)}}
    >
      {props.title}
    </button>
  )
}

const ListHeader = (props) => {
  var styling = "border-b-2 border-gray-800 mr-[10px] flex justify-start "
  return(
    <div className={styling} style={{width: props.width + 'px'}}>{props.name}</div>
  )
}

const HeaderBar = () => {
  return(
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
  const [catNames, setCatNames] = useState([])

  useEffect(()=>{
    if (props.categoryView) {
      let names = []
      for (const [name, array] of Object.entries(props.items)) {
        names.push(name)
      }
      setCatNames(names)
    }
    
  },[props.items])


  return(
    <div className="flex-col items-start">
      { !props.categoryView && <HeaderBar />}

      <div className="h-[780px] w-full overflow-y-scroll text-gray-800 font-ubuntu">
        <div>
        {
          !props.categoryView && props.items && props.items.map((data) => {
              return<ListItem data={data} key={uuidv4()}/>
            }
          )
        }
        {
          props.categoryView && props.items && catNames.map((name) => {
            return <CategoryDropdown name={name} data={props.items[name]} key ={uuidv4()}/>
          })
        }
        </div>
      </div>
    </div>
  )
}

const ListItem = (props) => {
  return(
    <div className="h-[35px] w-full text-sm font-ubunutu flex justify-start border-b-2 border-gray-300">
      <div className="w-[400px] h-full flex items-center mr-[10px]">
        <span className="truncate">{props.data.call_frame.functionName ? props.data.call_frame.functionName: "(anonymous)"}</span>
      </div>
      <div className="w-[800px] h-full flex items-center mr-[10px]">
        <span className="truncate">{props.data.call_frame.url ? props.data.call_frame.url: "N/A"}</span>
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
      <div className="w-[300px] h-full flex items-center mr-[10px]">
        <span className="truncate">
          {props.data.avg_watts ? parseFloat(props.data.avg_watts).toFixed(1): "Not Measured"}
        </span>
      </div>
    </div>
  )
}

const CategoryDropdown = (props)=> {
  const [expanded, setExpanded] = useState(false)

  return(
    <div>
      <div 
        className="w-full h-[40px] text-sm font-bold rounded-md border-2 border-b-gray-300 pl-[10px] flex items-center mb-[5px] hover:bg-gray-300"
        onClick={()=>{setExpanded(!expanded)}}
        >
        {props.name}
      </div>
          {
            expanded && props.data && <HeaderBar />
          }
          {
            expanded && props.data &&  props.data.map((data) => {
              return <ListItem data={data} />
            })
          }
    </div>
  )
}

function App() {
  //Load data from file

  const [activeView, setActiveView] = useState("All")
  const [renderItems, setRenderItems] = useState([])
  const [allNodes, setAllNodes] = useState(null)

  useEffect(()=> {

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
      renderArrays["Node Modules"][name] = array.map((id) => {
        return profile.node_map[id]
      })
    }
    for (const [name, array] of Object.entries(profile.categories.node_js)) {
      renderArrays["NodeJS Internal"][name] = array.map((id) => {
        return profile.node_map[id]
      })
    }
    setAllNodes(renderArrays)
    setRenderItems(renderArrays["All"])
  }, [])

  const viewHandler = (view) => {
    setActiveView(view)
    if (view === "Graph View"){
      setRenderItems([])
    } else {
      setRenderItems(allNodes[view])
    }
  }

  return (
    <div className="h-full pb-[50px] w-[1920px] m-auto pt-[20px] pl-[20px]" >
      <Title name={profile.name}/>
      <NavBar buttonHandler={viewHandler} activeView={activeView}></NavBar>
      <ListView items={renderItems} categoryView={activeView === "NodeJS Internal" || activeView==="Node Modules"}/>
    </div>
  );
}

export default App;
