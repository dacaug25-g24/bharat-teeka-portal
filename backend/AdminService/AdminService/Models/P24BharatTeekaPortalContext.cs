using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace AdminService.Models;

public partial class P24BharatTeekaPortalContext : DbContext
{
    public P24BharatTeekaPortalContext()
    {
    }

    public P24BharatTeekaPortalContext(DbContextOptions<P24BharatTeekaPortalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Hospital> Hospitals { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<ParentChild> ParentChildren { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Relationship> Relationships { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Slot> Slots { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vaccine> Vaccines { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=root;database=p24_bharat_teeka_portal", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.2.0-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PRIMARY");

            entity.ToTable("appointment");

            entity.HasIndex(e => e.HospitalId, "hospital_id");

            entity.HasIndex(e => e.PatientId, "patient_id");

            entity.HasIndex(e => e.SlotId, "slot_id");

            entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
            entity.Property(e => e.BookingDate).HasColumnName("booking_date");
            entity.Property(e => e.BookingTime)
                .HasColumnType("time")
                .HasColumnName("booking_time");
            entity.Property(e => e.DoseNumber).HasColumnName("dose_number");
            entity.Property(e => e.HospitalId).HasColumnName("hospital_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Remarks)
                .HasColumnType("text")
                .HasColumnName("remarks");
            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Pending'")
                .HasColumnType("enum('Pending','Completed','Cancelled')")
                .HasColumnName("status");

            entity.HasOne(d => d.Hospital).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.HospitalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointment_ibfk_2");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointment_ibfk_1");

            entity.HasOne(d => d.Slot).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.SlotId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointment_ibfk_3");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PRIMARY");

            entity.ToTable("city");

            entity.HasIndex(e => e.StateId, "state_id");

            entity.Property(e => e.CityId).HasColumnName("city_id");
            entity.Property(e => e.CityName)
                .HasMaxLength(50)
                .HasColumnName("city_name");
            entity.Property(e => e.StateId).HasColumnName("state_id");

            entity.HasOne(d => d.State).WithMany(p => p.Cities)
                .HasForeignKey(d => d.StateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("city_ibfk_1");
        });

        modelBuilder.Entity<Hospital>(entity =>
        {
            entity.HasKey(e => e.HospitalId).HasName("PRIMARY");

            entity.ToTable("hospital");

            entity.HasIndex(e => e.CityId, "city_id");

            entity.HasIndex(e => e.RegistrationNo, "registration_no").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.HospitalId).HasColumnName("hospital_id");
            entity.Property(e => e.CityId).HasColumnName("city_id");
            entity.Property(e => e.HospitalName)
                .HasMaxLength(100)
                .HasColumnName("hospital_name");
            entity.Property(e => e.HospitalType)
                .HasColumnType("enum('Government','Private')")
                .HasColumnName("hospital_type");
            entity.Property(e => e.RegistrationNo)
                .HasMaxLength(50)
                .HasColumnName("registration_no");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.City).WithMany(p => p.Hospitals)
                .HasForeignKey(d => d.CityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("hospital_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Hospitals)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("hospital_ibfk_1");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PRIMARY");

            entity.ToTable("notification");

            entity.HasIndex(e => e.AppointmentId, "appointment_id");

            entity.HasIndex(e => e.HospitalId, "hospital_id");

            entity.HasIndex(e => e.PatientId, "patient_id");

            entity.HasIndex(e => e.SlotId, "slot_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.HasIndex(e => e.VaccineId, "vaccine_id");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
            entity.Property(e => e.HospitalId).HasColumnName("hospital_id");
            entity.Property(e => e.Message)
                .HasColumnType("text")
                .HasColumnName("message");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Unread'")
                .HasColumnType("enum('Unread','Read')")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.VaccineId).HasColumnName("vaccine_id");

            entity.HasOne(d => d.Appointment).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.AppointmentId)
                .HasConstraintName("notification_ibfk_6");

            entity.HasOne(d => d.Hospital).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.HospitalId)
                .HasConstraintName("notification_ibfk_3");

            entity.HasOne(d => d.Patient).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("notification_ibfk_4");

            entity.HasOne(d => d.Slot).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.SlotId)
                .HasConstraintName("notification_ibfk_5");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("notification_ibfk_1");

            entity.HasOne(d => d.Vaccine).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.VaccineId)
                .HasConstraintName("notification_ibfk_2");
        });

        modelBuilder.Entity<ParentChild>(entity =>
        {
            entity.HasKey(e => e.ParentChildId).HasName("PRIMARY");

            entity.ToTable("parent_child");

            entity.HasIndex(e => e.ChildPatientId, "child_patient_id");

            entity.HasIndex(e => e.ParentUserId, "parent_user_id");

            entity.HasIndex(e => e.RelationId, "relation_id");

            entity.Property(e => e.ParentChildId).HasColumnName("parent_child_id");
            entity.Property(e => e.ChildPatientId).HasColumnName("child_patient_id");
            entity.Property(e => e.ParentUserId).HasColumnName("parent_user_id");
            entity.Property(e => e.RelationId).HasColumnName("relation_id");

            entity.HasOne(d => d.ChildPatient).WithMany(p => p.ParentChildren)
                .HasForeignKey(d => d.ChildPatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("parent_child_ibfk_2");

            entity.HasOne(d => d.ParentUser).WithMany(p => p.ParentChildren)
                .HasForeignKey(d => d.ParentUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("parent_child_ibfk_1");

            entity.HasOne(d => d.Relation).WithMany(p => p.ParentChildren)
                .HasForeignKey(d => d.RelationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("parent_child_ibfk_3");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PRIMARY");

            entity.ToTable("patient");

            entity.HasIndex(e => e.AadharNumber, "aadhar_number").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.AadharNumber)
                .HasMaxLength(12)
                .HasColumnName("aadhar_number");
            entity.Property(e => e.BloodGroup)
                .HasMaxLength(5)
                .HasColumnName("blood_group");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.Gender)
                .HasColumnType("enum('Male','Female','Other')")
                .HasColumnName("gender");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.IsAdult)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_adult");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.Remarks)
                .HasColumnType("text")
                .HasColumnName("remarks");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Patients)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("patient_ibfk_1");
        });

        modelBuilder.Entity<Relationship>(entity =>
        {
            entity.HasKey(e => e.RelationId).HasName("PRIMARY");

            entity.ToTable("relationship");

            entity.Property(e => e.RelationId).HasColumnName("relation_id");
            entity.Property(e => e.RelationshipName)
                .HasMaxLength(50)
                .HasColumnName("relationship_name");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PRIMARY");

            entity.ToTable("role");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<Slot>(entity =>
        {
            entity.HasKey(e => e.SlotId).HasName("PRIMARY");

            entity.ToTable("slot");

            entity.HasIndex(e => e.HospitalId, "hospital_id");

            entity.HasIndex(e => e.VaccineId, "vaccine_id");

            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.BookedCount)
                .HasDefaultValueSql("'0'")
                .HasColumnName("booked_count");
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.EndTime)
                .HasColumnType("time")
                .HasColumnName("end_time");
            entity.Property(e => e.HospitalId).HasColumnName("hospital_id");
            entity.Property(e => e.SlotDate).HasColumnName("slot_date");
            entity.Property(e => e.StartTime)
                .HasColumnType("time")
                .HasColumnName("start_time");
            entity.Property(e => e.VaccineId).HasColumnName("vaccine_id");

            entity.HasOne(d => d.Hospital).WithMany(p => p.Slots)
                .HasForeignKey(d => d.HospitalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("slot_ibfk_1");

            entity.HasOne(d => d.Vaccine).WithMany(p => p.Slots)
                .HasForeignKey(d => d.VaccineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("slot_ibfk_2");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.StateId).HasName("PRIMARY");

            entity.ToTable("state");

            entity.Property(e => e.StateId).HasColumnName("state_id");
            entity.Property(e => e.StateName)
                .HasMaxLength(50)
                .HasColumnName("state_name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.Phone, "phone").IsUnique();

            entity.HasIndex(e => e.RoleId, "role_id");

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address)
                .HasColumnType("text")
                .HasColumnName("address");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .HasColumnName("phone");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_ibfk_1");
        });

        modelBuilder.Entity<Vaccine>(entity =>
        {
            entity.HasKey(e => e.VaccineId).HasName("PRIMARY");

            entity.ToTable("vaccine");

            entity.Property(e => e.VaccineId).HasColumnName("vaccine_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.DoseGapDays).HasColumnName("dose_gap_days");
            entity.Property(e => e.DoseRequired).HasColumnName("dose_required");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.Manufacturer)
                .HasMaxLength(100)
                .HasColumnName("manufacturer");
            entity.Property(e => e.ManufacturingDate).HasColumnName("manufacturing_date");
            entity.Property(e => e.MaxAge).HasColumnName("max_age");
            entity.Property(e => e.MinAge).HasColumnName("min_age");
            entity.Property(e => e.SideEffects)
                .HasColumnType("text")
                .HasColumnName("side_effects");
            entity.Property(e => e.StorageTemperature).HasColumnName("storage_temperature");
            entity.Property(e => e.VaccineName)
                .HasMaxLength(100)
                .HasColumnName("vaccine_name");
            entity.Property(e => e.VaccineType)
                .HasMaxLength(50)
                .HasColumnName("vaccine_type");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
