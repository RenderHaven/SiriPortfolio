# Frontend Architecture & Development Guide

# SiriPortfolio Frontend

## Overview

The SiriPortfolio frontend is a modern, responsive web application built using **React**, **Vite**, and **Tailwind CSS**.

The application serves as the public-facing website for Siri Photography, allowing customers to browse the studio portfolio, explore photography packages, add services to a shopping cart, and submit booking inquiries.

The frontend consumes REST APIs exposed by the FastAPI backend. All portfolio images, categories, and service packages are dynamically loaded from the backend, ensuring that changes made through the SiriAdmin dashboard are immediately reflected on the website.

---

# Technology Stack

## Core

* React 19
* TypeScript
* Vite
* Tailwind CSS

---

## Routing

* React Router DOM

---

## API

* Axios

---

## State Management

* TanStack Query (React Query)
* React Context API (Shopping Cart)

---

## Forms

* React Hook Form
* Zod Validation

---

## UI Components

* shadcn/ui
* Lucide React Icons

---

## Image Handling

Images are served directly from Cloudinary.

The frontend never uploads or stores images.

---

# Project Goals

The website should:

* Present a professional photography portfolio.
* Showcase photography service packages.
* Allow customers to browse by category.
* Allow customers to build a booking cart.
* Submit booking inquiries.
* Provide an excellent experience across desktop, tablet, and mobile devices.

---

# Application Structure

```text
src/

│
├── api/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── gallery/
│   ├── layout/
│   ├── services/
│   ├── booking/
│   └── ui/
│
├── context/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── routes/
│
├── services/
│
├── types/
│
├── utils/
│
└── App.tsx
```

---

# Website Pages

## Home

Purpose

Landing page introducing Siri Photography.

Sections

* Hero Banner
* Studio Introduction
* Featured Portfolio
* Featured Services
* Customer Testimonials (optional)
* CTA to View Portfolio
* CTA to Book Services
* Footer

---

## Portfolio

Purpose

Display all photography work.

Features

* Responsive image grid
* Lazy loading
* Category filtering
* Image lightbox
* Previous / Next navigation
* Smooth animations

Categories

* Wedding
* Birthday
* Corporate Events
* Pre Wedding
* Baby Shoot

Images are loaded dynamically from the backend.

---

## Services

Purpose

Display available photography packages.

Each service displays

* Cover Image
* Title
* Description
* Included Services
* Price

Actions

* Add to Cart

---

## Shopping Cart

Purpose

Store customer-selected services.

Features

* Add service
* Remove service
* Update quantity (optional)
* Display subtotal
* Persist after page refresh
* Continue shopping
* Proceed to Booking

Cart data should be stored in Local Storage.

---

## Booking

Purpose

Collect booking inquiry.

Fields

* Customer Name
* Email
* Phone Number
* Event Date
* Selected Services
* Special Requirements

After submission

* Send booking to backend
* Display confirmation message
* Clear shopping cart

---

# Layout

The website layout should contain

```text
Navbar

↓

Hero

↓

Main Content

↓

Footer
```

Navigation

* Home
* Portfolio
* Services
* Cart
* Contact

Sticky navigation is recommended.

---

# Components

Reusable components

* Navbar
* Footer
* Hero Banner
* Page Header
* Image Card
* Gallery Grid
* Gallery Filter
* Lightbox
* Service Card
* Cart Drawer
* Cart Item
* Booking Form
* Empty State
* Button
* Modal
* Input
* Select
* Date Picker
* Loading Spinner
* Skeleton Loader

---

# API Integration

The frontend must consume the FastAPI backend.

No static or mock data should be used.

Portfolio

* Get Categories
* Get Portfolio Images

Services

* Get Services

Bookings

* Submit Booking Inquiry

All API types should be generated from the FastAPI OpenAPI specification.

---

# State Management

React Query

Use React Query for

* Categories
* Portfolio
* Services

Cart Context

Use Context API for

* Shopping Cart
* Cart Count
* Cart Total

Persist the cart using Local Storage.

---

# Responsive Design

Support

* Desktop
* Tablet
* Mobile

Use Tailwind's responsive utilities.

Gallery

Desktop

4 columns

Tablet

2 columns

Mobile

1 column

---

# Gallery Behavior

Images should

* Lazy load
* Preserve aspect ratio
* Open in lightbox
* Support keyboard navigation
* Display loading placeholder
* Handle failed image loading gracefully

---

# Shopping Cart Workflow

```text
Browse Services

↓

Add to Cart

↓

View Cart

↓

Checkout

↓

Booking Form

↓

Submit Inquiry

↓

Confirmation
```

---

# Data Flow

```text
React

↓

Axios

↓

FastAPI REST API

↓

PostgreSQL

↓

Cloudinary
```

Portfolio images are loaded using the Cloudinary URLs returned by the backend.

---

# Loading States

Every API request should display

* Skeleton cards
* Loading spinners
* Disabled buttons while submitting

---

# Error Handling

Display user-friendly messages.

Examples

* Unable to load gallery.
* Network error.
* Booking submitted successfully.
* Booking failed.
* Image unavailable.

---

# Performance

Requirements

* Lazy loading images
* Code splitting
* Route-based lazy loading
* Optimized image rendering
* Query caching
* Minimize unnecessary re-renders

---

# Accessibility

The application should support

* Keyboard navigation
* Proper labels
* Focus indicators
* Semantic HTML
* Screen reader compatibility

---

# Folder Organization

The project should follow feature-based architecture.

Each feature owns

* Components
* Hooks
* API
* Types

Avoid placing all files into a single components folder.

---

# Code Standards

* TypeScript Strict Mode
* Functional Components
* React Hooks
* Reusable Components
* Clean Folder Structure
* Meaningful Variable Names
* No Duplicate Code

---

# Future Enhancements

Possible future improvements

* Customer Accounts
* Online Payments
* Reviews
* Blog
* Favorites
* Multi-language Support
* Dark Mode
* Image Search
* Advanced Gallery Filters

---

# Final Objective

Develop a modern, elegant, and responsive photography portfolio website that showcases Siri Photography's work, enables customers to explore service packages, manage a shopping cart, and submit booking inquiries.

The application should integrate seamlessly with the FastAPI backend and automatically reflect updates made through the SiriAdmin dashboard without requiring frontend modifications.
