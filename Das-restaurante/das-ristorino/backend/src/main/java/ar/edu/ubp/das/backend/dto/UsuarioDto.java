package ar.edu.ubp.das.backend.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para usuarios/clientes del sistema
 * Mapea la tabla clientes de la base de datos
 */
public class UsuarioDto {
    
    private String nroCliente; // UUID generado por la BD
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 120, message = "El apellido no puede exceder 120 caracteres")
    private String apellido;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder 120 caracteres")
    private String nombre;
    
    private String clave; // Hash de la contraseña (no se expone en responses)
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    @Size(max = 150, message = "El correo no puede exceder 150 caracteres")
    private String correo;
    
    @Size(max = 120, message = "El teléfono no puede exceder 120 caracteres")
    private String telefonos;
    
    @NotBlank(message = "La localidad es obligatoria")
    private String nroLocalidad; // FK a localidades
    
    private Boolean habilitado = true;
    
    // Constructores
    public UsuarioDto() {}
    
    public UsuarioDto(String nombre, String apellido, String correo, String telefonos, String nroLocalidad) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefonos = telefonos;
        this.nroLocalidad = nroLocalidad;
    }
    
    // Getters y Setters
    public String getNroCliente() {
        return nroCliente;
    }
    
    public void setNroCliente(String nroCliente) {
        this.nroCliente = nroCliente;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getClave() {
        return clave;
    }
    
    public void setClave(String clave) {
        this.clave = clave;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getTelefonos() {
        return telefonos;
    }
    
    public void setTelefonos(String telefonos) {
        this.telefonos = telefonos;
    }
    
    public String getNroLocalidad() {
        return nroLocalidad;
    }
    
    public void setNroLocalidad(String nroLocalidad) {
        this.nroLocalidad = nroLocalidad;
    }
    
    public Boolean getHabilitado() {
        return habilitado;
    }
    
    public void setHabilitado(Boolean habilitado) {
        this.habilitado = habilitado;
    }
    
    @Override
    public String toString() {
        return "UsuarioDto{" +
                "nroCliente='" + nroCliente + '\'' +
                ", apellido='" + apellido + '\'' +
                ", nombre='" + nombre + '\'' +
                ", correo='" + correo + '\'' +
                ", telefonos='" + telefonos + '\'' +
                ", nroLocalidad='" + nroLocalidad + '\'' +
                ", habilitado=" + habilitado +
                '}';
    }
}
