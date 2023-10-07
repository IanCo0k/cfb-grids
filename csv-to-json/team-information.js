import fs from 'fs/promises';

function csvToJson(csv) {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const jsonArr = [];
    
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(",");
        
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        
        jsonArr.push(obj);
    }
    
    return JSON.stringify(jsonArr, null, 4);
}

async function writeJsonToFile(csvData, fileName) {
    const jsonData = csvToJson(csvData);
    
    try {
        await fs.writeFile(fileName, jsonData);
        console.log(`Data written to file: ${fileName}`);
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

async function main() {
    try {
        const myCsvData = await fs.readFile('./team-information.csv', 'utf8');
        await writeJsonToFile(myCsvData, 'output.json');
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

main();
