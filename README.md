# Expense Tracker Mobile Application

A local-first, privacy-focused mobile application built for tracking personal expenses, managing group split bills, and analyzing financial data with monthly budget comparisons and spreadsheet exports.

## Downloads & Installation

| Platform | Type | Download Link |
| --- | --- | --- |
| Android | Direct APK | [Download APK](https://www.google.com/search?q=https://github.com/your-username/expense-tracker/releases/latest/download/app-release.apk) |
| iOS / Android | Source Build | Clone repository and run via Expo |

## Tech Stack

| Category | Technology / Library | Version |
| --- | --- | --- |
| Framework | Expo / React Native | `~57.0.20` / `0.86.3` |
| Language | TypeScript | `~6.0.3` |
| Navigation & Routing | Expo Router | `~57.0.19` |
| Local Database | Expo SQLite | `~57.0.2` |
| Styling | NativeWind / Tailwind CSS | `^4.2.6` / `^3.4.17` |
| Icons | Lucide React Native | `^1.41.0` |
| Animations & Gestures | React Native Reanimated | `4.5.1` |
| Spreadsheet Export | SheetJS (`xlsx`) | `^0.18.5` |
| File Sharing | Expo Sharing | `^57.0.18` |

## Database Schema

| Table Name | Description | Key Fields |
| --- | --- | --- |
| `expenses` | Stores individual personal expenses and self-shares from splits (amounts stored in Paise). | `id`, `amount`, `category`, `date`, `notes`, `receipt_uri` |
| `split_bills` | Stores parent group split bill transactions. | `id`, `title`, `total_amount`, `paid_by`, `date`, `status` |
| `split_participants` | Stores participant shares and settlement tracking for individual split bills. | `id`, `split_bill_id`, `name`, `share_amount`, `is_paid`, `paid_at` |
| `user_settings` | Stores persistent global user preferences such as monthly budget caps. | `monthly_budget`, `currency` |

## Core Features

* **Expense Management**: Log, view, filter by category/date range, and remove individual expenses with instant UI re-renders.
* **Split Bill Integration**: Create multi-participant split bills, automatically log personal shares to the main expense ledger, and manage individual participant settlement statuses. Cascade deletion ensures related expenses are removed when a split bill is deleted.
* **Analytics Dashboard**: Monitor monthly spending vs budget utilization, calculate daily spending pace, project end-of-month totals, and review category breakdowns and transaction averages.
* **Excel Data Export**: Compile comprehensive multi-section financial reports into a `.xlsx` spreadsheet using SheetJS and native device sharing.
* **Local-First Architecture**: All data operations persist locally via SQLite transactions ensuring high performance and offline reliability.

## Getting Started from Source

### Prerequisites

Ensure the following tools are installed on your development environment:

* Node.js (LTS version)
* npm or yarn
* Expo Go (for physical device testing) or an iOS/Android simulator

### Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker

```


2. Install dependencies:
```bash
npm install

```


3. Run the development server:
```bash
npx expo start

```


4. Choose your run target:
* Press `a` for Android emulator.
* Press `i` for iOS simulator.
* Scan the QR code using the Expo Go app on a physical mobile device.
