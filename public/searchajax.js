// Function to display results
const displayResults = (result) => {
    const divElement = document.getElementById("output");
    // Reset output at each call
    divElement.innerHTML = "";

    if (result.trans === "Error") {
        divElement.innerHTML += `
        <h2>Application Error</h2><br>
        <p>${result.result}</p>
        `
    } else {
        if (result.result.length === 0) {
            divElement.innerHTML += `<h3>No records found!</h3>`;
        } else {
            var tdText = "";
            //(carvin, carmake, carmodel, carmileage)
            result.result.forEach(car => { 
                tdText += `
                <tr>
                    <td>${car.carvin}</td>
                    <td>${car.carmake}</td>
                    <td>${car.carmodel}</td>
                    <td>${car.carmileage}</td>
                </tr>
             `
            });
           //divElement.innerHTML = "Test";
           divElement.innerHTML += `
           <table>
            <thead>
                <tr>
                    <th>VIN</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Mileage</th>
                </tr>
            </thead>
            <tbody>
                ${tdText}
            </tbody>
          </table>           
        `
        };
    };
};

// Handle form submission
document.querySelector("form").addEventListener("submit", e => {
    // Cancel default behavior of sending a synchronous POST request
    e.preventDefault();

    let carvinElement = document.getElementById("carvin");
    let carmileageElement = document.getElementById("carmileage");
    if( carvinElement && carmileageElement )
    {
        if( carvinElement.value != "" && isNaN( carvinElement.value ) )
        {
            alert( "Car VIN must be numeric" );
        }
        else if( carmileageElement.value != "" && isNaN( carmileageElement.value ) )
        {
            alert( "Car milage must be numeric" );
        }
        else
        {
            // Create a FormData object, passing the form as a parameter
            const formData = new FormData(e.target);
            fetch("/", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                displayResults(result);
            })
            .catch(err => {
                console.error(err.message);
            });
        }
    }


});