 Orbital Food Ordering System
Bu proje, bir restoranın online sipariş sistemini içeren bir Django (Backend) + React (Frontend) uygulamasıdır.

🛠 Gereksinimler
Projeyi çalıştırmadan önce aşağıdaki araçların sisteminizde yüklü olması gerekir:

Python 3.10+ (Backend için)
Node.js 16+ & npm (Frontend için)
Git (Opsiyonel ama önerilir)
Virtualenv (Python sanal ortam yönetimi için)
📂 Proje Dizini
bash
Kopyala
Düzenle
orbital/
│── backend/              # Django Backend Klasörü
│── frontend/             # React Frontend Klasörü
│── db.sqlite3            # SQLite Veritabanı
│── README.md             # Kurulum ve Kullanım Talimatları
│── manage.py             # Django Yönetim Komutları
🚀 Backend Kurulumu ve Çalıştırma
Aşağıdaki adımları izleyerek backend (Django) sunucusunu çalıştırabilirsiniz.

1️⃣ Backend Repo'yu Klonlayın
sh
Kopyala
Düzenle
git clone <REPO_URL>
cd orbital/backend
2️⃣ Virtualenv (Sanal Ortam) Oluştur ve Aktifleştir
sh
Kopyala
Düzenle
# Windows için
python -m venv venv
venv\Scripts\activate

# Mac / Linux için
python3 -m venv venv
source venv/bin/activate
3️⃣ Gerekli Python Paketlerini Kurun
sh
Kopyala
Düzenle
pip install -r requirements.txt
4️⃣ Veritabanını Yükleyin
sh
Kopyala
Düzenle
# Eğer sıfırdan kuruyorsanız:
python manage.py migrate

# Eğer var olan bir db.sqlite3 dosyanız varsa, sadece veritabanını güncelleyin:
python manage.py makemigrations
python manage.py migrate
5️⃣ Superuser (Admin Kullanıcısı) Oluşturun
sh
Kopyala
Düzenle
python manage.py createsuperuser
Kullanıcı adı, e-posta ve şifreyi girdikten sonra admin paneli için bir hesap oluşturulmuş olacak.
6️⃣ Backend Sunucusunu Çalıştırın
sh
Kopyala
Düzenle
python manage.py runserver
Bu komut ile Django API'si http://127.0.0.1:8000/ adresinde çalışacaktır.

💻 Frontend Kurulumu ve Çalıştırma
Aşağıdaki adımları izleyerek frontend (React) uygulamasını çalıştırabilirsiniz.

1️⃣ Frontend Dizine Girin
sh
Kopyala
Düzenle
cd ../frontend
2️⃣ Gerekli Paketleri Kurun
sh
Kopyala
Düzenle
npm install
3️⃣ Frontend Sunucusunu Çalıştırın
sh
Kopyala
Düzenle
npm start
Bu komut ile React uygulaması http://localhost:3000/ adresinde çalışacaktır.

🌐 API Endpoint’leri
Endpoint	Açıklama
/api/menu-items/	Menüdeki ürünleri getirir
/api/categories/	Menü kategorilerini getirir
/api/basket/	Kullanıcının sepetini getirir
/api/item-details/<item_id>/	Belirtilen ürünün detaylarını getirir
🛠 Geliştirme Modu
Eğer kodları düzenleyip geliştirme yapmak isterseniz, hem backend hem de frontend'i farklı terminallerde çalıştırmalısınız:

1️⃣ Terminal - Backend Çalıştırma

sh
Kopyala
Düzenle
cd backend
venv\Scripts\activate
python manage.py runserver
2️⃣ Terminal - Frontend Çalıştırma

sh
Kopyala
Düzenle
cd frontend
npm start
❓ Sorun Giderme
Eğer bir hata alırsanız, aşağıdaki adımları deneyin:

Paketler eksikse:
sh
Kopyala
Düzenle
pip install -r requirements.txt  # Backend için
npm install  # Frontend için
Veritabanı hatası alırsanız:
sh
Kopyala
Düzenle
python manage.py migrate
Backend veya Frontend başlamıyorsa terminali kapatıp tekrar başlatın.
👨‍💻 Katkıda Bulunma
Bu projeye katkıda bulunmak isterseniz:

git clone <REPO_URL> komutuyla projeyi kendi bilgisayarınıza klonlayın.
Yeni bir branch açarak geliştirmelerinizi yapın.
Pull Request (PR) açarak katkılarınızı paylaşın.
