
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Award, Users, FileText, Settings, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerService } from "@/services/customer.service";
import { CertificateService } from "@/services/certificate.service";
import { DeviceTypeService } from "@/services/device-type.service";
import { ReferenceDeviceService } from "@/services/reference-device.service";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  
  const [stats, setStats] = useState({
    customerCount: 0,
    certificateCount: 0,
    deviceCount: 0,
    referenceDeviceCount: 0,
  });
  
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all statistics
        const [customers, certificates, deviceTypes, referenceDevices] = await Promise.all([
          CustomerService.getAll(),
          CertificateService.getAll(),
          DeviceTypeService.getAll(),
          ReferenceDeviceService.getAll(),
        ]);

        setStats({
          customerCount: customers.length,
          certificateCount: certificates.length,
          deviceCount: deviceTypes.length,
          referenceDeviceCount: referenceDevices.length,
        });

        // Get recent customers (last 5)
        const sortedCustomers = customers
          .slice(-5)
          .map(customer => ({
            id: customer.customersId?.toString() || '',
            name: customer.title,
            date: new Date().toLocaleDateString('tr-TR'),
          }));
        setRecentCustomers(sortedCustomers);

        // Get recent certificates (last 5)
        const sortedCertificates = certificates
          .slice(-5)
          .map(cert => ({
            id: cert.certificateId?.toString() || '',
            customerName: cert.customerName || 'Bilinmeyen Müşteri',
            deviceType: cert.deviceTypeName || 'Bilinmeyen Cihaz',
            date: new Date(cert.calibratorDate).toLocaleDateString('tr-TR'),
          }));
        setRecentCertificates(sortedCertificates);

      } catch (error) {
        console.error('Dashboard data loading error:', error);
        toast.error('Dashboard verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hoş Geldiniz, {user?.employeeNameSurname}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Müşteri</p>
              <p className="text-3xl font-bold">{stats.customerCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Sertifika</p>
              <p className="text-3xl font-bold">{stats.certificateCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cihaz Türleri</p>
              <p className="text-3xl font-bold">{stats.deviceCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Referans Cihazlar</p>
              <p className="text-3xl font-bold">{stats.referenceDeviceCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Kalibrasyon Uyarıları
            </CardTitle>
            <CardDescription>
              Kalibrasyon süresi yaklaşan cihazlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li key={notification.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <p className="font-medium">{notification.deviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message} ({notification.daysLeft} gün kaldı)
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Kalibrasyon uyarısı bulunmamaktadır.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="space-y-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Son Eklenen Müşteriler</CardTitle>
              <CardDescription>
                Son 5 müşteri
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCustomers.length > 0 ? (
                <ul className="space-y-2">
                  {recentCustomers.map((customer) => (
                    <li key={customer.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                      <span>{customer.name}</span>
                      <span className="text-sm text-muted-foreground">{customer.date}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Müşteri bulunamadı.</p>
              )}
              <div className="mt-4 text-right">
                <Link to="/musteri-listesi" className="text-sm text-primary hover:underline">
                  Tüm müşterileri görüntüle
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Son Sertifikalar</CardTitle>
              <CardDescription>
                Son oluşturulan kalibrasyon sertifikaları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCertificates.length > 0 ? (
                <ul className="space-y-2">
                  {recentCertificates.map((cert) => (
                    <li key={cert.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                      <div>
                        <p>{cert.customerName}</p>
                        <p className="text-sm text-muted-foreground">{cert.deviceType}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{cert.date}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Sertifika bulunamadı.</p>
              )}
              <div className="mt-4 text-right">
                <Link to="/tum-sertifikalar" className="text-sm text-primary hover:underline">
                  Tüm sertifikaları görüntüle
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
