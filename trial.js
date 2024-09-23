const fs = require('fs');

// Function to decode values based on the base provided
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation
function lagrangeInterpolation(points) {
    let constantTerm = 0;

    for (let i = 0; i < points.length; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = points[j][0];
                term *= (-xj) / (xi - xj);
            }
        }

        constantTerm += term;
    }

    return constantTerm;
}

// Main function to read JSON file and calculate the constant term
function findConstantTerm(filePath) {
    // Read the input JSON file
    let rawData = fs.readFileSync(filePath);
    let inputData = JSON.parse(rawData);

    // Extract the number of roots and the required number of points to solve the polynomial
    const n = inputData.keys.n;
    const k = inputData.keys.k;

    // Collect the decoded (x, y) points
    let points = [];

    // Loop through the properties dynamically (no assumption of sequential keys)
    for (let key in inputData) {
        if (key !== 'keys' && inputData[key]) {
            const x = parseInt(key); // Get the key (which represents the x-value)
            const base = parseInt(inputData[key].base);
            const yEncoded = inputData[key].value;
            const y = decodeValue(base, yEncoded); // Decode y based on the base
            points.push([x, y]);
        }
    }

    // Sort points by x value (not strictly necessary but can help with clarity)
    points.sort((a, b) => a[0] - b[0]);

    // We need exactly k points to solve for the polynomial
    if (points.length >= k) {
        // Apply Lagrange interpolation to find the constant term
        const constantTerm = lagrangeInterpolation(points.slice(0, k));
        console.log(points)
        console.log("Constant term (c):", constantTerm);
    } else {
        console.error("Not enough points to solve the polynomial.");
    }
}

// Example usage: replace 'input.json' with the path to your JSON test case
findConstantTerm('input.json');
findConstantTerm('input1.json');
