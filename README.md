Fireworks Inventory and Show Management Application

Description
This application is designed to manage fireworks inventory and organize fireworks shows. It allows users to track inventory, create and manage shows, assign fireworks to shows, and view detailed information about each show and inventory item.

Key Features

Inventory Management: Track fireworks items, including quantity, price, and details.
Show Management: Create, edit, and delete fireworks shows.
Inventory Assignment: Assign fireworks to specific shows with quantity tracking.
Budget Tracking: Monitor show budgets and prevent overspending.
Video Integration: View product videos for fireworks items.
Printable Show Details: Generate printable summaries of show inventories.
Real-time Updates: Live data synchronization using Supabase.

Technologies Used

Next.js
React
Supabase (for backend and real-time data)
Tailwind CSS
Shadcn UI components
Tanstack Table (for data tables)
Sonner (for toast notifications)

Usage
(Provide basic instructions on how to run the application locally)
Database
The application uses Supabase as its database. Key tables include:

inventory: Stores fireworks items
shows: Manages fireworks shows
show_inventory: Links inventory items to specific shows

API
The application uses Supabase RPC functions for database operations, including:

insert_show_inventory
update_show_inventory
