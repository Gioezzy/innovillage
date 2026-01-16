import { getUserProfile } from '@/lib/actions/profile';
import ProfileEditForm from '@/components/profile/profile-edit-form';
import ChangePasswordForm from '@/components/profile/change-password-form';

export const metadata = {
  title: 'Profil Saya - Nilam Bordir',
};

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-gray-600">Profile tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
          Profil Saya
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi pribadi dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold font-heading text-foreground mb-6 flex items-center">
            <span className="w-1 h-8 bg-primary rounded-full mr-3" />
            Informasi Pribadi
          </h2>
          <ProfileEditForm profile={profile} />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold font-heading text-foreground mb-6 flex items-center">
            <span className="w-1 h-8 bg-secondary rounded-full mr-3" />
            Keamanan Akun
          </h2>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
