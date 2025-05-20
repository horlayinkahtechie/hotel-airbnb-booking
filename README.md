**Hotel/Airbnb Booking System Documentation**

This is a full-stack Hotel or Airbnb-style Booking System built with Next.js using the App Router. It features a multi-step reservation system for guests, role-based access, and an admin dashboard for managing rooms and bookings.

**Features**

  **Guest Features**
    - Google Sign-In via NextAuth
    - Browse rooms and filter by availability
    - Multi-step booking process
    - Confirmation, booking summary and payment
    - View booking history

  **Admin Features**
    - Add, edit, or delete rooms
    - View all bookings
    - View revenue and occupancy analytics
    - Role-based access control


**Booking Flow**
  Step 1: Select listings among room listings and choose the type you want to book.
  Step 2: Proceed to checkout page where users will input their details like check in, check out, full name, payment method. Each Room has an ID and a room with the same ID cannot be booked by two different users within the same time range. 
  Step 3: Proceed to pay a non-refundable booking fee.
  Step 4: Receive a notification of confirmation.

**Reservation Flow**
  Step 1: Users visit the room reservations page. 
  Step 2: Users input details like email, full name, room type, check in date and time, number of guests, phone number.
  Step 3: Users then submit their reservation, before submission selected date for reservation will be checked automatically to see if there is reservation for that particular date.
  Step 4: Recieve a notification of confirmation.


**Technologies used in building BookNest**

  **Frontend Technologies**
    **- Next.js (React Framework):** BookNest uses Next.js for its frontend because of its SSR (Server-Side Rendering) capabilities, which provide faster page load times, image optimization and better SEO.
    **- Tailwind CSS:**  Tailwind is a utility-first CSS framework used for styling the UI with minimal custom CSS, which makes it easier to maintain and customize and used for responsive design accross all devices.
    **- Shadcn/UI & Headless UI:** Used for clean, accessible components like modals, dropdowns, calendars, etc., without bloated styles.
    **- Heroicons & Lucide Icons:** Used for visually communicating intent (e.g., calendar icons, clock, navigation).
    
  **Backend Technologies**
    **- Supabase:** Supabase serves as the database for Booknest project
    **- Authentication:** I used NextAuth for secure authentication of users using their google account.
    **- Email Notification:** I used EmailJS for sending notifications of bookings and reservations.
  
