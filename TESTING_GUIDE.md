# 🚀 Quick Start Guide - Testing New Features

## Prerequisites

- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`
- User account created and logged in

---

## 🧪 Testing Dashboard Enhancements

### Test 1: Recent Transactions Widget

**Steps:**

1. Go to Dashboard
2. Scroll to "Recent Transactions" section
3. **Expected:** See your last 5 transactions with:
   - Green arrow (↑) for income, Red arrow (↓) for expenses
   - Category name
   - Date formatted as "MMM dd, yyyy"
   - Amount with ₹ symbol
4. Click "View All" button
5. **Expected:** Redirects to Transactions page

**Success Criteria:**
✅ Widget loads without errors
✅ Shows maximum 5 transactions
✅ Icons match transaction type
✅ Dates are properly formatted
✅ Navigation works

---

### Test 2: Budget Progress Widget

**Steps:**

1. First, create at least 1 budget in Budgets page
2. Add some transactions in that budget category
3. Return to Dashboard
4. Look at "Budget Progress" section
5. **Expected:** See your budgets with:
   - Category name
   - Amount spent / Total amount
   - Progress bar (green if < 80%, yellow if 80-100%, red if over)
   - Percentage and remaining amount

**Success Criteria:**
✅ Shows top 3 budgets
✅ Progress bar color matches spending level
✅ Percentage calculation is accurate
✅ Remaining amount is correct
✅ "View All" navigates to Budgets page

---

### Test 3: Upcoming Bills Widget

**Steps:**

1. First, create a recurring transaction (see next section)
2. Dashboard should show "Upcoming Bills" widget
3. **Expected:** See bills due within 3 days with:
   - Red background for urgent (due today/tomorrow)
   - Orange background for upcoming (2-3 days)
   - Category and frequency badge
   - Days until due
   - Amount

**Success Criteria:**
✅ Only shows bills due within 3 days
✅ Color coding matches urgency
✅ Date calculations are correct
✅ All bill information displays

---

### Test 4: Quick Actions

**Steps:**

1. Look at bottom section of Dashboard
2. **Expected:** See 4 gradient cards:
   - Add Transaction (Purple/Pink)
   - Upload Receipt (Blue/Cyan)
   - Set Budget (Green/Emerald)
   - Create Goal (Orange/Red)
3. Hover over each card
4. **Expected:** Card scales up, icon rotates
5. Click each card
6. **Expected:** Navigates to correct page

**Success Criteria:**
✅ All 4 cards display with gradients
✅ Hover animations work smoothly
✅ Navigation works for all cards
✅ Icons are correct

---

## 🔔 Testing Bill Reminders System

### Test 5: Create Recurring Transaction

**Steps:**

1. Go to Transactions page
2. Click "Add Transaction" button
3. Fill in normal transaction details:
   - Type: Expense
   - Amount: 1500
   - Category: Internet
   - Date: Today's date
   - Merchant: Airtel
   - Description: Monthly broadband
4. **NEW:** Check the box "This is a recurring transaction"
5. **Expected:** Frequency dropdown appears
6. Select "Monthly"
7. Click "Add Transaction"
8. **Expected:** Transaction saved successfully

**Success Criteria:**
✅ Checkbox toggles frequency dropdown
✅ All frequency options available (Daily, Weekly, Monthly, Yearly)
✅ Form validation requires frequency when recurring is checked
✅ Transaction saves with recurring fields

---

### Test 6: View Upcoming Bills on Dashboard

**Steps:**

1. After creating recurring transaction from Test 5
2. Go to Dashboard
3. **Expected:** See bill in "Upcoming Bills" widget
4. **Verify:**
   - Category shows "Internet"
   - Amount shows ₹1,500
   - Shows "Due in X days" based on next occurrence
   - Frequency badge shows "MONTHLY"

**Success Criteria:**
✅ Bill appears in widget
✅ Information is accurate
✅ Urgency color is correct based on days

---

### Test 7: Bill Notifications

**Steps:**

1. With recurring transaction created
2. Click bell icon (🔔) in navbar
3. **Expected:** Notification panel opens
4. Should see notification for upcoming bill:
   - "Bill Due Soon!" or "Upcoming Bill" as title
   - Category and amount in message
   - Days until due
   - Red badge for urgent, orange for upcoming

**Success Criteria:**
✅ Notification appears for upcoming bills
✅ Notification count shows in badge
✅ Color coding matches urgency
✅ All details are accurate

---

### Test 8: Edit Recurring Transaction

**Steps:**

1. Go to Transactions page
2. Find the recurring transaction
3. Click Edit button
4. **Expected:** Form shows:
   - Checkbox is checked
   - Frequency dropdown shows current value
5. Change frequency from "Monthly" to "Weekly"
6. Click "Update Transaction"
7. Return to Dashboard
8. **Expected:** Next due date updated to 1 week from transaction date

**Success Criteria:**
✅ Form loads with recurring fields populated
✅ Can change frequency
✅ Next due date recalculates correctly
✅ Dashboard reflects changes

---

## 🔍 Testing Search & Filters

### Test 9: Basic Search

**Steps:**

1. Go to Transactions page
2. Type "food" in search box
3. **Expected:** Real-time filtering as you type
4. Only transactions with "food" in:
   - Category OR
   - Description OR
   - Merchant name
5. Try other search terms

**Success Criteria:**
✅ Filters in real-time
✅ Case-insensitive search
✅ Searches all relevant fields
✅ Shows result count

---

### Test 10: Advanced Filters - Type Filter

**Steps:**

1. In Transactions page
2. Click "Advanced Filters" button
3. **Expected:** Filter panel expands
4. Select Type: "Expense"
5. **Expected:** Only expenses show
6. Change to "Income"
7. **Expected:** Only income shows

**Success Criteria:**
✅ Filter panel toggles correctly
✅ Type filter works
✅ Results update immediately

---

### Test 11: Advanced Filters - Date Range

**Steps:**

1. Open Advanced Filters
2. Set Start Date: First day of last month
3. Set End Date: Last day of last month
4. **Expected:** Only transactions from that month show
5. Try different date ranges

**Success Criteria:**
✅ Date pickers work
✅ Date range filter is accurate
✅ Handles edge cases (same start/end date)

---

### Test 12: Advanced Filters - Amount Range

**Steps:**

1. Open Advanced Filters
2. Set Min Amount: 500
3. Set Max Amount: 2000
4. **Expected:** Only transactions between ₹500-₹2000 show
5. Try setting only min or only max
6. **Expected:** Works with one bound

**Success Criteria:**
✅ Amount filters work independently
✅ Range filtering is accurate
✅ Decimal amounts handled correctly

---

### Test 13: Combined Filters

**Steps:**

1. Use search: "food"
2. Open Advanced Filters
3. Set Type: Expense
4. Set Category: "Food"
5. Set Min Amount: 100
6. **Expected:** Only food expenses over ₹100 show
7. Click "Clear Filters"
8. **Expected:** All filters reset, all transactions show

**Success Criteria:**
✅ Multiple filters work together (AND logic)
✅ Clear filters button appears when filters active
✅ Clear filters resets everything
✅ Search also clears

---

### Test 14: Empty Search Results

**Steps:**

1. Search for "xyz123nonexistent"
2. **Expected:** See empty state:
   - "No transactions found" message
   - Dollar sign icon
   - Helpful text

**Success Criteria:**
✅ Empty state displays correctly
✅ No errors in console
✅ Message is helpful

---

## 🧑 Testing Profile Management

### Test 15: Change Password

**Steps:**

1. Go to Profile page
2. Click "Change Password" button in Account Settings
3. **Expected:** Modal opens with 3 password fields
4. Fill in:
   - Current Password: (your current password)
   - New Password: NewPass123!
   - Confirm Password: NewPass123!
5. Click eye icons to toggle password visibility
6. Click "Save Changes"
7. **Expected:** Success message appears
8. Try logging out and back in with new password

**Success Criteria:**
✅ Modal opens and closes correctly
✅ Password visibility toggles work
✅ Form validation (matching passwords)
✅ API call succeeds
✅ Can login with new password

---

### Test 16: Export Data

**Steps:**

1. In Profile page
2. Click "Export Data" button
3. **Expected:**
   - Button shows loading state
   - JSON file downloads automatically
4. Open the downloaded file
5. **Verify:** Contains:
   - User information
   - All transactions
   - All budgets
   - All savings goals
   - Analytics summary

**Success Criteria:**
✅ Download initiates automatically
✅ File is valid JSON
✅ All data is included
✅ Sensitive data (password) is excluded
✅ No errors during export

---

### Test 17: Delete Account

**Steps:**

1. In Profile page
2. Click "Delete Account" button
3. **Expected:** Confirmation modal opens with warning
4. Type your password
5. Click "Delete Account"
6. **Expected:**
   - Account deleted successfully
   - Automatically logged out
   - Redirected to login page
7. Try logging in again
8. **Expected:** Account does not exist

**⚠️ WARNING:** This actually deletes your account!
**Recommendation:** Test with a dummy account

**Success Criteria:**
✅ Confirmation modal shows warning
✅ Requires password for safety
✅ Successfully deletes account
✅ Logs out automatically
✅ Cannot login with deleted account

---

## 📱 Testing Enhanced Navbar

### Test 18: Profile Dropdown

**Steps:**

1. Look at top-right of any page
2. Click on profile avatar/name
3. **Expected:** Dropdown menu appears with:
   - "My Profile" option
   - "Logout" option
4. Click "My Profile"
5. **Expected:** Navigates to Profile page
6. Open dropdown again
7. Click "Logout"
8. **Expected:** Logs out and redirects to login

**Success Criteria:**
✅ Dropdown opens/closes smoothly
✅ Both options work
✅ Hover effects present
✅ Animation is smooth

---

### Test 19: Notification Center

**Steps:**

1. Click bell icon in navbar
2. **Expected:** Panel slides in from right
3. Should show:
   - Budget alerts (if any budgets over threshold)
   - Upcoming bills (if any recurring transactions)
   - Spending summary
4. Click "Mark All as Read"
5. **Expected:** Unread count goes to 0
6. Click individual notification mark as read
7. Click X to delete notification
8. Click outside panel to close

**Success Criteria:**
✅ Panel animation smooth
✅ Shows real notifications (not hardcoded)
✅ Badge count is accurate
✅ Mark as read works
✅ Delete works
✅ Closes on outside click

---

### Test 20: Dark Mode Toggle

**Steps:**

1. Click moon icon in navbar
2. **Expected:** Entire app switches to dark mode
3. **Verify:**
   - Background is dark
   - Text is light
   - Cards have dark background
   - Charts update colors
   - All pages maintain dark mode
4. Click sun icon
5. **Expected:** Switches back to light mode

**Success Criteria:**
✅ Toggle works on all pages
✅ Preference persists on page navigation
✅ All components support both modes
✅ No contrast issues
✅ Smooth transition

---

## 🎯 End-to-End Test Scenario

### Complete User Journey

**Scenario:** Track monthly expenses and set up bill reminders

1. **Login** to dashboard
2. **View** financial overview on Dashboard
3. **Add** recurring bill: Rent (Monthly, ₹15,000, due 1st)
4. **Add** recurring bill: Electric (Monthly, ₹2,000, due 5th)
5. **Create** budget: Housing (₹20,000)
6. **Add** several regular transactions in various categories
7. **Use search** to find specific transaction
8. **Use filters** to view last month's expenses
9. **Check** budget progress on Dashboard
10. **Review** upcoming bills section
11. **Click** notification bell to see bill reminders
12. **Change** profile settings
13. **Export** data for records
14. **Toggle** dark mode for comfortable viewing

**Expected Journey:**

- Smooth navigation throughout
- All features work together
- Data updates in real-time
- No errors or bugs
- Professional, polished experience

---

## 📊 Performance Testing

### Test 21: Load Performance

1. Open DevTools Network tab
2. Refresh Dashboard
3. **Check:**
   - Page loads in < 3 seconds
   - API calls complete in < 1 second each
   - No failed requests
   - No console errors

### Test 22: Large Data Set

1. Import/create 100+ transactions
2. Test search and filters
3. **Expected:**
   - No lag during typing
   - Filters apply smoothly
   - Dashboard widgets render fast

---

## 🐛 Bug Checklist

### Known Issues to Verify Fixed

- [x] Analytics Total Transactions showing "n/a"
- [x] Reports page not loading data
- [x] Reports dark mode styling issues
- [x] Budgets spent amount always 0
- [x] Notification showing fake data
- [x] Profile export button not working
- [x] Profile delete account not working

### Additional Checks

- [ ] No console errors on any page
- [ ] All API calls succeed
- [ ] Dark mode works everywhere
- [ ] Mobile responsive on all pages
- [ ] All forms validate correctly
- [ ] Loading states show during API calls
- [ ] Error messages are user-friendly

---

## 📝 Test Report Template

After testing, document results:

```markdown
## Test Execution Report

**Date:** [Date]
**Tester:** [Name]
**Environment:**

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Browser: [Chrome/Firefox/Safari]

### Dashboard Enhancements

- Recent Transactions: ✅ Pass / ❌ Fail
- Budget Progress: ✅ Pass / ❌ Fail
- Upcoming Bills: ✅ Pass / ❌ Fail
- Quick Actions: ✅ Pass / ❌ Fail

### Bill Reminders

- Create Recurring: ✅ Pass / ❌ Fail
- View Upcoming: ✅ Pass / ❌ Fail
- Notifications: ✅ Pass / ❌ Fail
- Edit Recurring: ✅ Pass / ❌ Fail

### Search & Filters

- Basic Search: ✅ Pass / ❌ Fail
- Type Filter: ✅ Pass / ❌ Fail
- Date Range: ✅ Pass / ❌ Fail
- Amount Range: ✅ Pass / ❌ Fail
- Combined Filters: ✅ Pass / ❌ Fail
- Clear Filters: ✅ Pass / ❌ Fail

### Profile Management

- Change Password: ✅ Pass / ❌ Fail
- Export Data: ✅ Pass / ❌ Fail
- Delete Account: ✅ Pass / ❌ Fail

### UI/UX

- Navbar Dropdown: ✅ Pass / ❌ Fail
- Notifications: ✅ Pass / ❌ Fail
- Dark Mode: ✅ Pass / ❌ Fail

### Issues Found

1. [Issue description]
2. [Issue description]

### Overall Status: ✅ All Pass / ⚠️ Some Issues / ❌ Major Issues
```

---

## 🎉 Success Criteria

Project is ready for demo/submission when:

✅ All 22 tests pass
✅ No console errors
✅ Dark mode works everywhere
✅ Mobile responsive
✅ All features functional
✅ Data persists correctly
✅ Professional UI/UX
✅ Smooth animations
✅ Fast load times
✅ Clear documentation

---

## 💡 Tips for Demo

1. **Prepare Test Data**

   - Create diverse transactions (income/expense)
   - Set up multiple budgets
   - Add recurring bills with different frequencies
   - Have some transactions exceeding budgets

2. **Demo Flow**

   - Start with Dashboard overview
   - Show all widgets with real data
   - Demonstrate search and filters
   - Create recurring transaction live
   - Show notification system
   - Toggle dark mode
   - Export data to show JSON

3. **Highlight Features**

   - Real-time updates
   - Smooth animations
   - Comprehensive filtering
   - Bill reminder system
   - Dark mode support
   - Profile management

4. **Be Prepared For Questions**
   - How is next due date calculated?
   - How do filters combine?
   - What happens when budget exceeded?
   - Is password stored securely?
   - How is data exported?

---

**Good luck with testing! 🚀**

If you find any issues, refer to:

- `ENHANCEMENTS_SUMMARY.md` for implementation details
- `FEATURE_SHOWCASE.md` for visual reference
- `README.md` for setup instructions
