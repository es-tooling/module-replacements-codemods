console.log(process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("npm") || process.env.npm_package_json && process.env.npm_package_json.endsWith("package.json"));
console.log(process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("yarn"));
console.log(process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("npm") || process.env.npm_package_json && process.env.npm_package_json.endsWith("package.json") || process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("yarn"));
