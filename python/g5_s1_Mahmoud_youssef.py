import tkinter as tk
from tkinter import messagebox
import math

# فئة لإنشاء أزرار مربعة باستخدام Canvas
class CalcButton(tk.Canvas):
    def __init__(self, parent, text, command, bg_color, fg_color, size=70):
        super().__init__(parent, width=size, height=size, bg="#f0f2f5", highlightthickness=0)
        self.command = command
        self.bg_color = bg_color
        self.fg_color = fg_color
        
        # رسم المربع
        pad = 2
        self.shape_id = self.create_rectangle(pad, pad, size-pad, size-pad, fill=bg_color, outline=bg_color)
        
        # كتابة النص في المنتصف
        self.text_id = self.create_text(size/2, size/2, text=text, fill=fg_color, font=("Arial", 18, "bold"))
        
        # ربط الأحداث (الضغط والتأثيرات)
        self.bind("<Button-1>", self.on_press)
        self.bind("<ButtonRelease-1>", self.on_release)
        self.bind("<Enter>", self.on_enter)
        self.bind("<Leave>", self.on_leave)

    def on_enter(self, e):
        self.itemconfig(self.shape_id, outline="#aaaaaa", width=2)

    def on_leave(self, e):
        self.itemconfig(self.shape_id, outline=self.bg_color, width=0)

    def on_press(self, e):
        # تأثير الضغط: وميض أبيض وعكس لون النص ليعطي شعوراً بالاستجابة
        self.itemconfig(self.shape_id, fill="#d1d1d6", outline="#d1d1d6")

    def on_release(self, e):
        # إعادة الألوان لطبيعتها
        self.itemconfig(self.shape_id, fill=self.bg_color)
        self.itemconfig(self.text_id, fill=self.fg_color)
        
        # تنفيذ الأمر فقط إذا تم الإفلات داخل حدود الزر (تجربة مستخدم أكثر سلاسة)
        if 0 <= e.x <= self.winfo_width() and 0 <= e.y <= self.winfo_height():
            self.on_enter(e) # إبقاء تأثير التحديد
            if self.command:
                self.command()
        else:
            self.on_leave(e) # إزالة التأثير إذا سحب المستخدم الماوس للخارج

# دالة العمليات الحسابية
def on_click(button_text):
    # تمكين الكتابة مؤقتاً لتعديل النص
    entry.configure(state="normal")
    
    current_text = entry.get()
    
    try:
        if button_text == "=":
            # تحويل العلامات لتفهمها لغة بيثون
            expression = current_text.replace('÷', '/').replace('×', '*').replace('^', '**')
            result = eval(expression)
            entry.delete(0, tk.END)
            entry.insert(tk.END, str(result))
            
        elif button_text == "C":
            entry.delete(0, tk.END)
            
        elif button_text == "DEL":
            entry.delete(len(current_text)-1)
            
        elif button_text == "√":
            entry.insert(tk.END, "math.sqrt(")
            
        elif button_text == "sin":
            entry.insert(tk.END, "math.sin(math.radians(")
            
        elif button_text == "cos":
            entry.insert(tk.END, "math.cos(math.radians(")
            
        elif button_text == "tan":
            entry.insert(tk.END, "math.tan(math.radians(")
            
        elif button_text == "log":
            entry.insert(tk.END, "math.log10(")
            
        elif button_text == "π":
            entry.insert(tk.END, str(math.pi))
            
        elif button_text == "x²":
            entry.insert(tk.END, "**2")
            
        else:
            entry.insert(tk.END, button_text)
            
    except Exception:
        messagebox.showerror("خطأ", "تأكد من إغلاق الأقواس أو صحة العملية")
    
    # إعادة الحقل لوضع القراءة فقط لمنع الكتابة العشوائية
    entry.configure(state="readonly")

# دالة للتعامل مع لوحة المفاتيح
def handle_keypress(event):
    key = event.keysym
    char = event.char
    
    if key == "Return":
        on_click("=")
    elif key == "BackSpace":
        on_click("DEL")
    elif key == "Escape":
        on_click("C")
    elif char == "*":
        on_click("×")
    elif char == "/":
        on_click("÷")
    elif char and char in "0123456789.+-()^":
        on_click(char)

# إنشاء النافذة
root = tk.Tk()
root.title("الآلة الحاسبة العلمية الشاملة")
root.geometry("500x700")
root.configure(bg="#f0f2f5") # خلفية فاتحة

# شاشة العرض كبيرة وواضحة
entry = tk.Entry(root, font=("Arial", 35), bg="#f0f2f5", fg="#000000", borderwidth=0, justify='right', state="readonly", readonlybackground="#f0f2f5")
entry.pack(pady=(40, 20), padx=20, fill="x")

# إطار الأزرار
button_frame = tk.Frame(root, bg="#f0f2f5")
button_frame.pack(expand=True, fill="both", padx=10, pady=10)

# قائمة الأزرار الشاملة
buttons = [
    'sin', 'cos', 'tan', 'log',
    '√', 'x²', '^', 'π',
    '(', ')', 'DEL', 'C',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
]

row_val = 0
col_val = 0

for button in buttons:
    # تنسيق الألوان
    if button in ["=", "÷", "×", "-", "+"]:
        bg_color = "#007aff" # أزرق للعمليات
        fg_color = "white"
    elif button in ["C", "DEL"]:
        bg_color = "#ff3b30" # أحمر للحذف
        fg_color = "white"
    elif button in ["sin", "cos", "tan", "log", "√", "x²", "^", "π", "(", ")"]:
        bg_color = "#e4e6eb" # رمادي فاتح للعمليات العلمية
        fg_color = "black"
    else:
        bg_color = "#ffffff" # أبيض للأرقام
        fg_color = "black"

    action = lambda x=button: on_click(x)
    
    # استخدام الفئة الجديدة للأزرار
    btn = CalcButton(button_frame, text=button, command=action, bg_color=bg_color, fg_color=fg_color, size=75)
    btn.grid(row=row_val, column=col_val, padx=5, pady=5)
    
    col_val += 1
    if col_val > 3:
        col_val = 0
        row_val += 1

# جعل الأزرار مرنة مع حجم الشاشة
for i in range(4): button_frame.grid_columnconfigure(i, weight=1)
for i in range(7): button_frame.grid_rowconfigure(i, weight=1)

# ربط لوحة المفاتيح
root.bind("<Key>", handle_keypress)

root.mainloop()