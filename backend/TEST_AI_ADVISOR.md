# AI Advisor Integration Test

## ✅ Backend Status

**Backend is running successfully on port 8080!**

## 🧪 Testing the AI Advisor

### Test the AI Advice API

You can test the AI Advisor by making a POST request to the `/api/ml/advice` endpoint.

#### Using PowerShell:

```powershell
# Test AI Advice
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    query = "How can I save ₹10,000 per month from my salary?"
    context = "Monthly income: ₹50,000"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/ml/advice" -Method Post -Headers $headers -Body $body

Write-Host "AI Advisor Response:"
Write-Host $response.data
```

#### Using cURL:

```bash
curl -X POST http://localhost:8080/api/ml/advice \
  -H "Content-Type: application/json" \
  -d '{"query":"How can I save ₹10,000 per month from my salary?","context":"Monthly income: ₹50,000"}'
```

### Expected Behavior

#### ✅ Success (Dynamic AI Response):

- Response should be detailed and specific to the question
- Different questions should get different answers
- Response length typically 200-500 words
- Personalized advice based on context

Example:

```json
{
  "success": true,
  "message": "Financial advice generated successfully",
  "data": "Based on your monthly income of ₹50,000, saving ₹10,000 (20% of income) is an excellent goal. Here's a comprehensive strategy:\n\n1. **Automate Your Savings**: Set up an automatic transfer of ₹10,000 to a separate savings account on salary day. This 'pay yourself first' approach ensures consistent savings.\n\n2. **Budget Allocation** (50/30/20 rule):\n   - Needs (50%): ₹25,000 for essentials like rent, utilities, groceries\n   - Wants (30%): ₹15,000 for entertainment, dining, hobbies\n   - Savings (20%): ₹10,000 for your goal\n\n..."
}
```

#### ❌ Failure (Static Fallback):

- Response would be generic bullet points
- Same response for all questions
- Limited advice categories

Example:

```json
{
  "success": true,
  "message": "Financial advice generated successfully",
  "data": "General Financial Advice:\n• Create and maintain a detailed monthly budget\n• Build an emergency fund covering 3-6 months of expenses\n• Pay off high-interest debts first\n..."
}
```

## 🔍 Check Backend Logs

After making the request, check the backend terminal logs for:

### ✅ Success Indicators:

```
INFO ... HuggingFaceService : Sending request to Gemini API for query: How can I save ₹10,000 per month from my salary?
INFO ... HuggingFaceService : Received response from Gemini API: {candidates=[...]}
INFO ... HuggingFaceService : Successfully generated advice: Based on your monthly income of ₹50,000, saving ₹...
```

### ❌ Failure Indicators:

```
ERROR ... HuggingFaceService : Failed to generate financial advice: [error message]
WARN ... : Using fallback advice for category: SAVINGS
```

## 🎯 Test Cases

### Test 1: Savings Question

```json
{
  "query": "How can I save ₹10,000 per month?",
  "context": "Income: ₹50,000"
}
```

### Test 2: Investment Question

```json
{
  "query": "Where should I invest ₹100,000 for 5 years?",
  "context": "Age: 30, Risk appetite: Moderate"
}
```

### Test 3: Debt Management

```json
{
  "query": "I have ₹200,000 credit card debt at 18% APR. What should I do?",
  "context": "Monthly income: ₹60,000"
}
```

### Test 4: Budget Planning

```json
{
  "query": "Help me create a monthly budget for ₹75,000 salary",
  "context": "Rent: ₹20,000, Family of 3"
}
```

## 📊 Success Criteria

✅ **AI Advisor is Working** if:

1. Each question gets a unique, detailed response
2. Backend logs show "Sending request to Gemini API"
3. Backend logs show "Successfully generated advice"
4. Response is contextual and personalized
5. Response length is substantial (200+ words)

❌ **AI Advisor is NOT Working** if:

1. All questions get the same generic response
2. Backend logs show errors or fallback warnings
3. Response is just bullet points (static fallback)
4. No "Gemini API" messages in logs

## 🐛 Troubleshooting

If AI Advisor is not working:

1. **Check API Key**:

   - Open `backend/src/main/resources/application.properties`
   - Verify: `gemini.api.key=AIzaSyAu12r5JuVgIdkloI7eL14LiwOkH630nzA`

2. **Check Network**:

   - Ensure internet connectivity
   - Test: `curl https://generativelanguage.googleapis.com/v1beta/models`

3. **Check Gemini API Quota**:

   - Visit: https://makersuite.google.com/app/apikey
   - Verify API key is active and has quota

4. **Check Backend Logs**:
   - Look for ERROR messages related to HuggingFaceService
   - Check for specific error messages from Gemini API

## 📝 Notes

- **API Key**: Using Google Gemini Pro API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Service**: `HuggingFaceService.java` (name kept for compatibility, but now uses Gemini)
- **Fallback**: System has rule-based fallback for 7 categories if API fails
