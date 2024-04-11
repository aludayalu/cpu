import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Card, Textarea} from "@nextui-org/react";
import { useState } from "react";

export default function Home() {
    var [code, setCode]=useState("")
    var [data, setData]=useState("")
    var [ip, setIp]=useState(0)
    var [cpu_data, setCPUData]=useState(0)
    var [operations, setOperations]=useState(["", ""])
    var [memory, setMemory]=useState([])
    var [simulate, setSimulate]=useState(false)
    var [log, setLog]=useState("")
    var new_code=""
    if (code.length!=0) {
        code.split("\n").forEach((element, i) => {
            new_code+=String(i)+": "+element+"\n"
        });
        if (new_code[new_code.length-1]=="\n") {
            new_code=new_code.slice(0, -1)
        }
        code=new_code
    } else {
        code="0: "
    }
    var new_data=""
    if (data.length!=0) {
        data.split("\n").forEach((element, i) => {
            new_data+=String(i)+": "+element+"\n"
        });
        if (new_data[new_data.length-1]=="\n") {
            new_data=new_data.slice(0, -1)
        }
        data=new_data
    } else {
        data="0: "
    }
    return (
        <>
            <Head>
                <title>CPU</title>
            </Head>


            <Text h1 className="vertical">ALU CPU</Text>
            <div style={{padding:"5vw"}} className="wrapper">
                <Card css={{width:"20vw", height:"55vh"}} variant="bordered">
                    <Text h2 className="vertical">Instructions</Text>
                    <Textarea css={{border:"1px solid rgba(255, 255, 255, 0.15)", margin:"1vw"}} value={code} rows={20} animated={false} onChange={(x)=>{
                        if (simulate) {
                            x.target.value=code
                            return
                        }
                        var code=x.target.value
                        var new_code=""
                        code.split("\n").forEach((x)=>{
                            if (x.split(": ")[1]!==undefined) {
                                new_code+=x.split(": ")[1]+"\n"
                            } else {
                                if (x.split(":")[1]!==undefined) {
                                    return
                                }
                                new_code+=x+"\n"
                            }
                        })
                        if (new_code[new_code.length-1]=="\n") {
                            new_code=new_code.slice(0, -1)
                        }
                        setCode(new_code)
                    }}></Textarea>
                </Card>
                <Spacer></Spacer>
                <Card css={{width:"20vw", height:"55vh"}} variant="bordered">
                    <Text h2 className="vertical">Data</Text>
                    <Textarea css={{border:"1px solid rgba(255, 255, 255, 0.15)", margin:"1vw"}} value={data} rows={20} animated={false} onChange={(x)=>{
                        if (simulate) {
                            x.target.value=data
                            return
                        }
                        var code=x.target.value
                        var new_code=""
                        code.split("\n").forEach((x)=>{
                            if (x.split(": ")[1]!==undefined) {
                                new_code+=x.split(": ")[1]+"\n"
                            } else {
                                if (x.split(":")[1]!==undefined) {
                                    return
                                }
                                new_code+=x+"\n"
                            }
                        })
                        if (new_code[new_code.length-1]=="\n") {
                            new_code=new_code.slice(0, -1)
                        }
                        setData(new_code)
                    }}></Textarea>
                </Card>
                <Spacer></Spacer>
                <Card css={{width:"20vw", height:"55vh"}} variant="bordered">
                    <Text h2 className="vertical">CPU</Text>
                    <div className="wrapper">
                        <Card variant="bordered" css={{margin:"1vw", p:"$5"}}>
                            <Text h2 color="success">IP: <span style={{color:"white"}}>{ip}</span></Text>
                            <Text h2 color="success">DATA: <span style={{color:"white"}}>{cpu_data}</span></Text>
                            <Text h2 color="success">OPERATION: <span style={{color:"white"}}>{operations[ip][0]}</span></Text>
                            <Text h2 color="success">OPERAND: <span style={{color:"white"}}>{operations[ip][1]}</span></Text>
                        </Card>
                    </div>
                    <div className="wrapper">
                        <Card variant="bordered" css={{margin:"1vw", p:"$5", height:"12vh", overflowY:"auto"}}>
                            {log.split("\n").map((x)=>{
                                return <Text>{x}</Text>
                            })}
                        </Card>
                    </div>
                </Card>
                <Spacer></Spacer>
                <Card css={{width:"20vw", height:"55vh"}} variant="bordered">
                    <Text h2 className="vertical">MEMORY</Text>
                    <div className="wrapper" style={{height:"80%"}}>
                        <Card variant="bordered" css={{margin:"1vw", p:"$5", height:"100%"}}>
                            {memory.map((x, i)=>{
                                return (
                                    <Text h4>{i}: {x}</Text>
                                )
                            })}
                        </Card>
                    </div>
                </Card>
            </div>
            <Spacer y={2}></Spacer>
            <div className="wrapper">
                <Button
                disabled={simulate}
                onClick={()=>{
                    var operations=[]
                    code.split("\n").forEach((x)=>{
                        if (x!=="" && x.split(": ")[1]!==undefined) {
                            var operation=x.split(": ")[1].split(" ")
                            if (operation[0]==="") {
                                return
                            }
                            var operand=Number(operation[1])
                            if (String(operand)==="NaN") {
                                operand=0
                            }
                            operations.push([operation[0], operand])
                        }
                    })
                    var datas=[]
                    data.split("\n").forEach((x)=>{
                        if (x!=="" && x.split(": ")[1]!==undefined) {
                            var data=x.split(": ")[1]
                            datas.push(Number(data))
                        }
                    })
                    if (operations.length==0) {
                        operations=["", ""]
                    }
                    setOperations(operations)
                    setMemory(datas)
                    setSimulate(true)
                    setIp(0)
                    setCPUData(0)
                    setLog("")
                }}
                >Compile</Button>
                <Spacer></Spacer>
                <Button disabled={!simulate} onClick={()=>{
                    if (operations[ip]===undefined) {
                        setSimulate(false)
                        setIp(0)
                        setOperations(["",""])
                        setCPUData(0)
                        return
                    }
                    if (simulate!=true) {
                        return
                    }
                    if (operations[ip][0]=="LOAD") {
                        setCPUData(memory[operations[ip][1]])
                    }
                    if (operations[ip][0]=="PRINT") {
                        setLog(log+String(cpu_data)+"\n")
                    }
                    if (operations[ip][0]=="ADD") {
                        setCPUData(cpu_data+memory[operations[ip][1]])
                    }
                    if (operations[ip][0]=="SUB") {
                        setCPUData(cpu_data-memory[operations[ip][1]])
                    }
                    if (operations[ip][0]=="JUMP") {
                        if (cpu_data!=0) {
                            setIp(operations[ip][1])
                            if (operations[operations[ip][1]]===undefined) {
                                setSimulate(false)
                                setIp(0)
                                setOperations(["",""])
                                setCPUData(0)
                            }
                            return
                        }
                        return
                    }
                    if (operations[ip][0]=="GREATER") {
                        if (cpu_data>memory[operations[ip][1]]) {
                            setCPUData(1)
                        } else {
                            setCPUData(0)
                        }
                    }
                    if (operations[ip][0]=="MULTIPLY") {
                        setCPUData(cpu_data*memory[operations[ip][1]])
                    }
                    if (operations[ip][0]=="STORE") {
                        memory[operations[ip][1]]=cpu_data
                        setMemory(memory)
                    }
                    if (operations[ip+1]===undefined) {
                        setSimulate(false)
                        return
                    } else {
                        setIp(ip+1)
                    }
                }}>Execute Instruction</Button>
                <Spacer></Spacer>
                <Button disabled={!simulate} onClick={()=>{
                    setSimulate(false)
                    setIp(0)
                    setOperations(["",""])
                    setCPUData(0)
                }}>Reset</Button>
            </div>
        </> 
    )
}