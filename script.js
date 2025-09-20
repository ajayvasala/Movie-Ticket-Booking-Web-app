// Global variables to track seat selection and prices
let selectedSeats = [];  // Array to hold selected seats
let maxSeats = 2;        // Maximum seats the user can select at once (default is 2)
let seatPrices = {
  'Recliner': 220,       // Price for Recliner seats
  'Prime': 180,          // Price for Prime seats
  'Classic': 130         // Price for Classic seats
};

// DOM elements
let optionOne = document.getElementById('option-1');
let optionTwo = document.getElementById('option-2');
let optionThree = document.getElementById('option-3');
let optionFour = document.getElementById('option-4');
let optionFive = document.getElementById('option-5');
let allOptions = document.querySelectorAll('.seat-option');
let transportImg = document.querySelector('.transport img');
let selectSeatsBtn = document.querySelector('.select-btn');
let seatModal = document.getElementById('seatModal');
let cinemaHall = document.querySelector('.container');
let seatCountElement = document.getElementById('seat-count');
let totalPriceElement = document.getElementById('total-price');
let bookButton = document.getElementById('book-button');

// Function to remove the "active" class from all seat options
function clearActiveClass() {
    allOptions.forEach(function(option) {
        option.classList.remove('active');
    });
}

// When a seat quantity option is clicked, update the maxSeats and the transport image
optionOne.addEventListener('click', function() {
    clearActiveClass();
    optionOne.classList.add('active');
    transportImg.src = 'images/bicycle_1.png';  
    maxSeats = 1;
});

optionTwo.addEventListener('click', function() {
    clearActiveClass();
    optionTwo.classList.add('active');
    transportImg.src = 'images/scooter_2.png';
    maxSeats = 2;
});

optionThree.addEventListener('click', function() {
    clearActiveClass();
    optionThree.classList.add('active');
    transportImg.src = 'images/auto_3.png';
    maxSeats = 3;
});

optionFour.addEventListener('click', function() {
    clearActiveClass();
    optionFour.classList.add('active');
    transportImg.src = 'images/minicar_4.png';
    maxSeats = 4;
});

optionFive.addEventListener('click', function() {
    clearActiveClass();
    optionFive.classList.add('active');
    transportImg.src = 'images/car_5.png';
    maxSeats = 5;
});

// Event listener for "Proceed to seat selection" button
selectSeatsBtn.addEventListener('click', function() {
    seatModal.style.display = "none";  
    cinemaHall.style.display = "block";  
});

// Function to get seat price based on the section (Recliner, Prime, or Classic)
function getSeatPrice(seatElement) {
    let sectionElement = seatElement;
    while (sectionElement && !sectionElement.classList.contains('seat-section')) {
        sectionElement = sectionElement.parentElement;
    }

    if (sectionElement) {
        let headerElement = sectionElement.previousElementSibling;
        if (headerElement && headerElement.tagName === 'H2') {
            const headerText = headerElement.textContent;
            if (headerText.includes('Recliner')) return seatPrices['Recliner'];
            if (headerText.includes('Prime')) return seatPrices['Prime'];
            if (headerText.includes('Classic')) return seatPrices['Classic'];
        }
    }
    
    return seatPrices['Classic'];  
}

// Function to update the summary of selected seats and total price
function updateSummary() {
    const totalSeats = selectedSeats.length;  
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);  
    
    seatCountElement.textContent = totalSeats;  
    totalPriceElement.textContent = `₹${totalPrice}`;  
    
    bookButton.disabled = totalSeats === 0;
}

// Function to handle seat selection (select or deselect seats)
function handleSeatSelection(event) {
    const seat = event.target;  
    
    if (!seat.classList.contains('available')) return;
    
    const seatId = getSeatId(seat);
    
    const isSelected = selectedSeats.some(s => s.id === seatId);
    
    if (isSelected) {
        seat.classList.remove('selected');
        seat.classList.add('available');
        
        selectedSeats = selectedSeats.filter(s => s.id !== seatId);
    } else {
        if (selectedSeats.length >= maxSeats) {
            alert(`You can only select up to ${maxSeats} seats.`);
            return;
        }
        
        seat.classList.remove('available');
        seat.classList.add('selected');
        
        const price = getSeatPrice(seat);
        selectedSeats.push({
            id: seatId,
            element: seat,
            price: price
        });
    }
    
    updateSummary();
}

// Function to generate a unique ID for a seat (based on row and seat number)
function getSeatId(seatElement) {
    let rowElement = seatElement;
    while (rowElement && !rowElement.classList.contains('seat-section')) {
        rowElement = rowElement.parentElement;
    }

    if (rowElement) {
        const rowLabelElement = rowElement.querySelector('.row-labels');
        if (rowLabelElement) {
            const rowLabel = rowLabelElement.textContent;
            return `${rowLabel}-${seatElement.textContent}`;
        }
    }
    
    return seatElement.textContent;  
}

// Add event listeners to all available seats when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const availableSeats = document.querySelectorAll('.seat.available');
    availableSeats.forEach(seat => {
        seat.addEventListener('click', handleSeatSelection);
    });
});

// Event listener for the "Book" button
bookButton.addEventListener('click', function() {
    if (selectedSeats.length > 0) {
        alert(`Booking confirmed for ${selectedSeats.length} seats! Total: ₹${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}`);
    }
});
