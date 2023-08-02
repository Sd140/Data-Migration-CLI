#!/usr/bin/env node
import modules from "./index.js"
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import path from "path";
import { execFile, exec } from 'child_process';
import { spawn } from "child_process";


async function welcome(){
    return new Promise((resolve)=>{
        const msg = "IBLIZ"
        figlet(msg, (err,data) =>{
            console.log(gradient.pastel.multiline(data));
            resolve();
        })
    });
}

// AWS ke liye !
let username;
async function askQ1() {
    return new Promise(async (resolve) => {
        const ans = await inquirer.prompt({
            name: 'player_name',
            type: 'input',
            message: 'Input the username : ',
            default() {
                return 'Player';
            },
        });
        username = ans.player_name;
        resolve(username);
    });
}

let prikeylc;

async function askQ4() {
    return new Promise(async (resolve) => {
        const ans = await inquirer.prompt({
            name: 'player_name',
            type: 'input',
            message: 'Input the Private key location : ',
            default() {
                return 'Private key location';
            },
        });
        prikeylc = ans.player_name;
        resolve(prikeylc);
    });
}
let databasenm;
async function askQ2() {
    return new Promise(async (resolve) => {
        const ans = await inquirer.prompt({
            name: 'player_name',
            type: 'input',
            message: 'Input the database name : ',
            default() {
                return 'Player';
            },
        });
        databasenm = ans.player_name;
        resolve(databasenm);
    });
}
let hostip;
async function askQ3() {
    return new Promise(async (resolve) => {
        const ans = await inquirer.prompt({
            name: 'player_name',
            type: 'input',
            message: 'Input the host IP : ',
            default() {
                return 'HOST IP';
            },
        });
        hostip = ans.player_name;
        resolve(hostip);
    });
}

// child process calling 
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
async function runScript(hostip, username, prikeylc) {
    const scriptPath = path.join(process.cwd(), "script.sh");
    execFile("bash", [scriptPath, hostip, username, prikeylc], (error, stdout, stderr) => {
      if (error) {
        console.error(`execFile error: ${error}`);
        return;
      }
      console.log(`${stdout}`);
    });
  }
  
//   async function runScriptforprem(hostip, username, databasenm) {
//     const scriptPath = path.join(process.cwd(), "sshscript.sh");
//     execFile("bash", [scriptPath, hostip, username, databasenm], (error, stdout, stderr) => {
//       if (error) {
//         console.error(`execFile error: ${error}`);
//         return;
//       }
//       console.log(`${stdout}`);
//     });
//   }
// async function runScriptforprem(hostip, username) {
//     const scriptPath = path.join(process.cwd(), "sshscript.sh");
//     execFile("bash", [scriptPath, username, hostip], (error, stdout, stderr) => {
//       if (error) {
//         console.error(`execFile error: ${error}`);
//         return;
//       }
//       console.log(`${stdout}`);
//     });
//   }
  
  async function question1() {
    await sleep();
    const answer = await inquirer.prompt({
      name: "question1",
      type: "list",
      message: "What do you want to do?",
      choices: [
        "Transfer on premise to on premise",
        "Transfer from on premise to AWS"
      ],
    });
    await spin();
    if (answer.question1 === "Transfer on premise to on premise") {
        await toPrem();
      }
    if (answer.question1 === "Transfer from on premise to AWS") {
        await toAws();
    }
    return;
  }
  async function toAws() {
    // Your code to transfer from on premise to AWS goes here
        await askQ1();
        // await askQ2();
        console.log("You are here !");
        await askQ3();
        console.log("You are here !");
        await askQ4();
        let spinner = createSpinner("Initializing AWS setup").start();
        modules.init_aws_setup(username+"@"+hostip, prikeylc);
        spinner.success({ text: "Completed the process !\n" });

        spinner = createSpinner("Generating AES Keys").start();
        modules.gen_aes_key();
        spinner.success({ text: "Completed the process !\n" });
        
        // console.log("Generating the aes key ");
        // await spin();
        spinner = createSpinner("Generating the key pair for AWS").start();
        modules.gen_key_pair();
        spinner.success({ text: "Completed the process !\n" });
        // console.log("Generating the key pair for AWS");

        // console.log(player);
        // await runScript(hostip, username, prikeylc);
  }

  async function toPrem() {
    // Your code to transfer from on premise to AWS goes here
        await askQ1();
        // await askQ2();
        await askQ3();
        // console.log(player);
        // await runScriptforprem(hostip, username, databasenm);
        await runScriptforprem(hostip, username);
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function spin() {
  const spinner = createSpinner("Wait till it is processing ..").start();
  await delay(5000);
  spinner.success({ text: "Completed the process !\n" });
  return;
}


async function main() {
    try {
        await welcome();
        // modules.init_setup(process.cwd.toString());
        await question1();
    } catch (error) {
        console.error(error);
    }
}

// Immediately-invoked function expression (IIFE) to execute main function
(async () => {
    await main();
})();
