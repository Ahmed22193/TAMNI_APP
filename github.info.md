Local Machine
|
| 1. Create branch -> feature/signup-page
| 2. Modify code
| 3. git add & commit
| 4. git push origin feature/signup-page
|
GitHub Repository
|
| 5. Open Pull Request on GitHub
| 6. Team reviews & approves
| 7. Merge into main branch
|
Local Machine (all team)
|
| 8. git checkout main
| 9. git pull origin main (get latest code)

1-
كود تنزيل الملف يستخدم مرة واحده
# git clone https://github.com/Ahmed22193/TAMNI_APP.git

2-
كل واحد يعمل فرع خاص بيه:

# git checkout -b my-feature

3-
بعد ما تخلص شغلك او اي تعديل تعمله وتخلصة تكتب الاوامر دي

# git add .

# git commit -m"هنا رسالة بالتعديل اللي اتعمل"

# git push origin my-feature

4-
بعد كدا بتروع ل (github)
Pull Requests بتفتح المشروع وتختار
 new pull request وبتدوس علي 
 وتضيف بقا رسالة باللي عملته مثلا خلصت صفحة كذا وكذا 

5- 
تحديث المستودع بشكل مستمر
كل فترة قبل ما تشتغل لازم تجيب آخر التحديثات من الفرع الرئيسي:

# git checkout main
# git pull origin main



---------------------


افتح Pull Request من GitHub
ادخل على صفحة المشروع على GitHub.

هتلاقي رسالة فوق بتقول:

“Compare & pull request”
اضغط عليها.

أو تدخل على تبويب Pull requests وتضغط New pull request.

5. اكتب تفاصيل الـ Pull Request
عنوان واضح للتعديلات.

وصف مختصر بيشرح إيه اللي اتغير.

لو فيه صور أو لقطات شاشة توضح التغيير، حطها.

6. أرسل الـ Pull Request
اضغط على Create pull request.

دلوقتي باقي الفريق يقدر يراجع الكود.

بعد الموافقة، حد من الفريق يضغط Merge عشان يدخل التغييرات للفرع الرئيسي.