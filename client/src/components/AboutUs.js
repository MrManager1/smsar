import React from 'react';

const teamMembers = [
  { name: 'أحمد المصري', role: 'المؤسس والرئيس التنفيذي', img: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'خبير عقاري بخبرة تمتد لأكثر من 15 عاماً في السوق المصري.' },
  { name: 'سارة القاضي', role: 'مديرة التسويق', img: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'متخصصة في استراتيجيات التسويق الرقمي للعقارات.' },
  { name: 'علي حسن', role: 'رئيس قسم المبيعات', img: 'https://randomuser.me/api/portraits/men/85.jpg', bio: 'قائد فريق المبيعات، يمتلك شبكة علاقات واسعة في المجال.' },
  { name: 'فاطمة الزهراء', role: 'مديرة علاقات العملاء', img: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'تضمن حصول كل عميل على أفضل تجربة ممكنة مع سمسار.' },
  { name: 'عضو جديد', role: 'مطور برمجيات', img: 'https://randomuser.me/api/portraits/men/10.jpg', bio: 'يعمل على تطوير وتحسين تجربة المستخدم في المنصة.' },
];

const AboutUs = () => {
  return (
    <div className="container py-5 fade-in">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">عن <span className="text-primary">سمسار</span></h1>
        <p className="lead text-muted">رواد التحول الرقمي في سوق العقارات المصري</p>
        <div className="bg-primary mx-auto mt-3 rounded-pill" style={{ width: '100px', height: '5px' }}></div>
      </div>

      {/* Our Mission */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Our Team" className="img-fluid rounded-3 shadow-lg" />
        </div>
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">مهمتنا ورؤيتنا</h2>
          <p className="text-muted">
            في سمسار، نسعى لإحداث ثورة في طريقة تفاعل الناس مع العقارات. مهمتنا هي توفير منصة شفافة، ذكية، وسهلة الاستخدام تجمع بين المشترين والبائعين والمستثمرين، مدعومة بأحدث التقنيات وتحليلات البيانات لضمان اتخاذ قرارات مستنيرة.
          </p>
          <p className="text-muted">
            رؤيتنا هي أن نكون البوابة الأولى والأكثر ثقة لكل من يبحث عن فرصة عقارية في مصر والشرق الأوسط، من خلال تقديم تجربة استثنائية تتجاوز توقعات عملائنا.
          </p>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">تعرف على فريقنا</h2>
        <p className="text-muted">العقول المبدعة التي تقف خلف نجاح سمسار.</p>
      </div>
      <div className="row g-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card h-100 text-center border-0 shadow-sm hover-lift">
              <div className="card-body">
                <img src={member.img} alt={member.name} className="rounded-circle mb-3 shadow" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                <h5 className="card-title fw-bold">{member.name}</h5>
                <p className="card-subtitle mb-2 text-primary">{member.role}</p>
                <p className="card-text small text-muted">{member.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
        .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important; }
      `}</style>
    </div>
  );
};

export default AboutUs;