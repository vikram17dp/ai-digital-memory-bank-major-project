# Quick Test Guide - Memory Bank

## 🚀 Before Testing

Make sure your dev server is running:
```bash
npm run dev
```

---

## ✅ Test 1: Create Memory with Images (S3 Upload)

1. **Go to** Add Memory section
2. **Choose** Manual or AI mode
3. **Fill in** title and content
4. **Upload** 1-2 images
5. **Select** a mood
6. **Add** some tags
7. **Click** Save Memory

**Expected Results**:
- ✅ Toast appears: "🎉 Memory saved successfully!" (2.5 seconds)
- ✅ Check S3 console: Images appear in `memories/` folder
- ✅ Check database: `imageUrl` and `images` fields have S3 URLs
- ✅ Memory card shows images from S3

**If it fails**:
- Check terminal logs for "Successfully uploaded image to: https://..."
- Verify AWS credentials in `.env`
- Check S3 bucket permissions

---

## ✅ Test 2: View Memory Details

1. **Click** on any memory card
2. **Modal opens** with full details
3. **Check**:
   - Title, content, date displayed
   - Images gallery (if multiple images)
   - Tags, mood, location, people
   - Favorite star icon (top right)
   - Edit button (blue pencil)
   - Delete button (red trash)

---

## ✅ Test 3: Edit Memory

1. **Open** memory detail modal
2. **Click** Edit button (blue pencil icon)
3. **Edit dialog opens**
4. **Modify**:
   - Change title
   - Update content
   - Change mood
   - Add/remove tags
   - Add new images
5. **Click** Save

**Expected Results**:
- ✅ Toast: "Memory updated successfully!" (2.5 seconds)
- ✅ Modal closes
- ✅ Changes visible in memory card
- ✅ New images uploaded to S3
- ✅ Database updated

---

## ✅ Test 4: Toggle Favorites

1. **Click** star icon on memory card OR
2. **Open** modal and click "Add to Favorites" button

**Expected Results**:
- ✅ Star fills with yellow color
- ✅ Toast: "⭐ Added to favorites!" (2 seconds)
- ✅ Click again to remove
- ✅ Toast: "✨ Removed from favorites" (2 seconds)
- ✅ Database `isFavorite` field toggles

---

## ✅ Test 5: Delete Memory

1. **Open** memory detail modal
2. **Click** Delete button (red trash icon)
3. **Confirmation dialog** appears
4. **Click** Delete

**Expected Results**:
- ✅ Toast: "🗑️ Memory deleted successfully" (2.5 seconds)
- ✅ Modal closes
- ✅ Memory card disappears from list
- ✅ Images deleted from S3
- ✅ Record deleted from database
- ✅ Page refreshes

---

## ✅ Test 6: Toast Notifications

**Check all toasts display for 2-3 seconds**:

| Action | Toast Message | Duration |
|--------|--------------|----------|
| Upload image | "📸 Image uploaded!" | 2s |
| Save memory | "🎉 Memory saved!" | 2.5s |
| Update memory | "Memory updated!" | 2.5s |
| Delete memory | "🗑️ Memory deleted!" | 2.5s |
| Add favorite | "⭐ Added to favorites!" | 2s |
| Remove favorite | "✨ Removed from favorites" | 2s |
| Add tag | "🏷️ Tag added!" | 2s |
| AI analysis | "✨ Details extracted!" | 2.5s |

**All toasts should**:
- ✅ Auto-dismiss after 2-3 seconds
- ✅ Have close button
- ✅ NOT last 1+ minute

---

## 🔍 Verify in AWS S3 Console

1. **Go to** AWS S3 Console
2. **Open** `ai-digital-memory-bank` bucket
3. **Navigate to** `memories/` folder
4. **Check**:
   - Images appear with UUID names
   - File sizes are correct
   - Images are optimized (resized if > 1920px)
   - Public URLs work when clicked

---

## 🗄️ Verify in Supabase Database

1. **Go to** Supabase dashboard
2. **Open** Table Editor
3. **Find** `Memory` table
4. **Check latest record**:
   - `imageUrl` has S3 URL
   - `images` array has all S3 URLs
   - `isFavorite` toggles correctly
   - All fields saved properly

---

## 🐛 Common Issues & Fixes

### Issue: Images not uploading to S3
**Fix**: 
1. Check `.env` has correct AWS credentials
2. Verify S3 bucket name is exact match
3. Check IAM permissions allow `s3:PutObject`
4. Look for errors in terminal logs

### Issue: Toast stays for 1+ minute
**Fix**: Already fixed! Check `app/layout.tsx` has `duration={2500}` prop

### Issue: Edit button doesn't work
**Fix**: Already fixed! EditMemoryDialog is now connected

### Issue: Delete doesn't remove from S3
**Fix**: Already fixed! DELETE route now calls `deleteFromS3()`

### Issue: 404 on image URLs
**Fix**: 
1. Check S3 bucket policy allows public read
2. Verify CORS is configured
3. Check bucket region matches `.env`

---

## 📋 Quick Checklist

Before deploying or demo:
- [ ] All toasts display for 2-3 seconds
- [ ] Images upload to S3 successfully
- [ ] S3 URLs stored in database
- [ ] Edit functionality works
- [ ] Delete removes from S3 and DB
- [ ] Favorites toggle works
- [ ] No console errors
- [ ] AWS credentials are secure (not in git)

---

## 🎉 Success Criteria

Your memory bank is working perfectly if:
✅ Can create memories with images
✅ Images stored in S3 (visible in AWS console)
✅ S3 URLs saved in Supabase database
✅ Can edit memories and add new images
✅ Can delete memories (removes from S3 + DB)
✅ Can toggle favorites
✅ All toasts show for 2-3 seconds
✅ UI refreshes automatically after changes

**Everything should be working now! 🚀**
