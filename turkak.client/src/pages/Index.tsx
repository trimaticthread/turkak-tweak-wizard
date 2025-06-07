
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  FileText, 
  Settings, 
  Monitor,
  BarChart3,
  Plus
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalCertificates: number;
  pendingCertificates: number;
  activeDeviceTypes: number;
  recentCertificates: any[];
  systemStatus: string;
}

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalCertificates: 0,
    pendingCertificates: 0,
    activeDeviceTypes: 0,
    recentCertificates: [],
    systemStatus: 'Aktif'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Burada gerçek API çağrıları yapılacak
        // Şimdilik mock data kullanıyoruz
        setStats({
          totalCustomers: 156,
          totalCertificates: 342,
          pendingCertificates: 12,
          activeDeviceTypes: 8,
          recentCertificates: [
            {
              id: 1,
              certificateNo: "KAL-2024-001",
              customerName: "ABC Teknoloji Ltd.",
              deviceType: "Terazi",
              status: "Onaylı",
              issueDate: "2024-01-15"
            },
            {
              id: 2,
              certificateNo: "KAL-2024-002", 
              customerName: "XYZ Endüstri A.Ş.",
              deviceType: "Manometre",
              status: "Beklemede",
              issueDate: "2024-01-14"
            }
          ],
          systemStatus: 'Aktif'
        });
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hoş Geldiniz, {user?.employeeNameSurname}
          </h1>
          <p className="text-muted-foreground mt-1">
            TURKAK Belge Doğrulama ve Takip Sistemi
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">Rol:</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {user?.employeeRole}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/sertifika-ekle">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Sertifika
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Kayıtlı müşteri sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sertifika</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Düzenlenmiş sertifika
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Sertifika</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Onay bekleyen sertifika
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Cihaz Türü</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeviceTypes}</div>
            <p className="text-xs text-muted-foreground">
              Kalibrasyon cihazı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/musteri-listesi" className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Müşteri Yönetimi</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/tum-sertifikalar" className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Sertifika Listesi</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/cihaz-turleri" className="flex flex-col items-center gap-2">
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm">Cihaz Türleri</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/turkak-ayarlari" className="flex flex-col items-center gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">TurkAk Ayarları</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Sertifikalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentCertificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cert.certificateNo}</p>
                    <p className="text-xs text-muted-foreground">{cert.customerName}</p>
                    <p className="text-xs text-muted-foreground">{cert.deviceType}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cert.status === 'Onaylı' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cert.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{cert.issueDate}</p>
                  </div>
                </div>
              ))}
              
              {stats.recentCertificates.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  Henüz sertifika bulunmuyor
                </p>
              )}
              
              <Button asChild variant="ghost" className="w-full">
                <Link to="/tum-sertifikalar">
                  Tüm Sertifikaları Görüntüle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Sistem durumu: {stats.systemStatus}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
