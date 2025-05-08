import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { consoleLogger } from '@algorandfoundation/algokit-utils/types/logging'
import * as fs from 'node:fs'
import * as path from 'node:path'

// Configure the logging and debugging
Config.configure({
  logger: consoleLogger,
  debug: true,
})
registerDebugEventHandlers()

// Base directory
const baseDir = path.resolve(__dirname)

// Function to validate and dynamically import a module
async function importDeployerIfExists(dir: string) {
  const deployerPath = path.resolve(dir, 'deploy-config')
  if (fs.existsSync(deployerPath + '.ts') || fs.existsSync(deployerPath + '.js')) {
    const deployer = await import(deployerPath)
    return { ...deployer, name: path.basename(dir) }
  }
  return null
}

// Get a list of all deployers from subdirectories
async function getDeployers() {
  const directories = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.resolve(baseDir, dirent.name))

  const deployers = await Promise.all(directories.map(importDeployerIfExists))
  return deployers.filter((deployer) => deployer !== null) // Filter out null values
}

// Execute all the deployers
;(async () => {
  const contractName = process.argv.length > 2 ? process.argv[2] : undefined
  const contractDeployers = await getDeployers()

  const filteredDeployers = contractName
    ? contractDeployers.filter((deployer) => deployer.name === contractName)
    : contractDeployers

  if (contractName && filteredDeployers.length === 0) {
    console.warn(`No deployer found for contract name: ${contractName}`)
    return
  }

  // Run deployers for the selected contract
  for (const deployer of filteredDeployers) {
    try {
      await deployer.deploy()
    } catch (e) {
      console.error(`Error deploying ${deployer.name}:`, e)
    }
  }
})()
