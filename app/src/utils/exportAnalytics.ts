import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { AnalyticsData } from '@/database/analyticsService';

export async function exportAnalyticsToExcel(analytics: AnalyticsData, budget: number) {
    try {
        const remaining = Math.max(budget - analytics.currentMonthSpend, 0);
        const utilization = budget > 0 ? Math.min(Math.round((analytics.currentMonthSpend / budget) * 100), 100) : 0;
        const dailyPace = analytics.elapsedDays > 0 ? analytics.currentMonthSpend / analytics.elapsedDays : 0;
        const projectedSpend = Math.round(dailyPace * analytics.daysInMonth);

        // Combine all analytics sections into a single contiguous array layout
        const combinedData = [
            ["EXPENSE TRACKER ANALYTICS REPORT"],
            [],
            ["BUDGET SUMMARY"],
            ["Monthly Budget", budget / 100],
            ["Total Spent", analytics.currentMonthSpend / 100],
            ["Remaining Budget", remaining / 100],
            ["Budget Utilization", `${utilization}%`],
            ["Projected Spend", projectedSpend / 100],
            [],
            ["SPENDING PACE & AVERAGES"],
            ["Total Transactions", analytics.transactionCount],
            ["Average Daily Spend", Math.round(dailyPace / 100)],
            ["Average Transaction Amount", analytics.transactionCount > 0 ? Math.round((analytics.currentMonthSpend / analytics.transactionCount) / 100) : 0],
            ["Previous Month Spend", analytics.prevMonthSpend / 100],
            [],
            ["CATEGORY BREAKDOWN"],
            ["Category", "Amount (Rs.)"],
            ...analytics.categoryBreakdown.map(cat => [cat.category, cat.totalAmount / 100]),
            [],
            ["SPLIT BILL INSIGHTS"],
            ["Total Outstanding Owed to You", analytics.totalOutstanding / 100],
            [],
            ["Split Status", "Count"],
            ...analytics.splitStatusCounts.map(s => [s.status, s.count]),
            [],
            ["PENDING FROM FRIENDS"],
            ["Name", "Amount Owed (Rs.)"],
            ...analytics.participantOwed.map(p => [p.name, p.totalOwed / 100]),
            [],
            ["TOP EXPENSES"],
            ["Category", "Amount (Rs.)", "Date", "Notes"],
            ...analytics.topExpenses.map(exp => [
                exp.category,
                exp.amount / 100,
                new Date(exp.date).toLocaleDateString('en-IN'),
                exp.notes || ''
            ])
        ];

        // Create Workbook and append to a single worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(combinedData);

        XLSX.utils.book_append_sheet(wb, ws, "Analytics");

        // Write Base64 Excel File
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        const fileUri = `${FileSystem.documentDirectory}analytics_report.xlsx`;

        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing is not available on this device");
            return;
        }

        await Sharing.shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Export Analytics Report',
            UTI: 'com.microsoft.excel.xlsx',
        });
    } catch (error) {
        console.error("Failed to export Excel report:", error);
        alert("Failed to export Excel report.");
    }
}