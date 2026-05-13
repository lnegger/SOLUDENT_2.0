Text                                                                                                                                                                                                                                                           
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




CREATE  PROCEDURE dbo.SP_Edicion_Citas_Agenda
                                                                                                                                                                                                            
@Accion	VARCHAR(3),		
                                                                                                                                                                                                                                        
@CodCia varchar(2),
                                                                                                                                                                                                                                          
@CedulaPaciente varchar(12),
                                                                                                                                                                                                                                 
@Representado varchar(2),
                                                                                                                                                                                                                                    
@FechaCita DATETIME,
                                                                                                                                                                                                                                         
@HoraCita varchar(13),
                                                                                                                                                                                                                                       
@Confirmada BIT,
                                                                                                                                                                                                                                             
@Silla INT
                                                                                                                                                                                                                                                   
AS
                                                                                                                                                                                                                                                           

                                                                                                                                                                                                                                                             
If @Accion = 'INC'
                                                                                                                                                                                                                                           
	BEGIN
                                                                                                                                                                                                                                                       
		IF NOT EXISTS(SELECT CedulaPaciente FROM Citas WHERE 
                                                                                                                                                                                                      
					CodCia = @CodCia 
                                                                                                                                                                                                                                       
					AND FechaCita = @FechaCita 
                                                                                                                                                                                                                             
					AND HoraCita = @HoraCita
                                                                                                                                                                                                                                
					AND Silla = @Silla)
                                                                                                                                                                                                                                     
			INSERT INTO Citas 
                                                                                                                                                                                                                                        
				(CodCia, CedulaPaciente,Representado,FechaCita,HoraCita,
                                                                                                                                                                                                 
				 Confirmada, Silla)
                                                                                                                                                                                                                                      
				VALUES(@CodCia, @CedulaPaciente, @Representado, @FechaCita, 
                                                                                                                                                                                             
					@HoraCita, @Confirmada, @Silla)
                                                                                                                                                                                                                         
	END
                                                                                                                                                                                                                                                         
	IF @Accion = 'ELI'
                                                                                                                                                                                                                                          
		DELETE Citas WHERE 
                                                                                                                                                                                                                                        
			CodCia = @CodCia 
                                                                                                                                                                                                                                         
			AND FechaCita = @FechaCita 
                                                                                                                                                                                                                               
			AND HoraCita = @HoraCita
                                                                                                                                                                                                                                  
			AND Silla = @Silla
                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                             
	IF @Accion = 'ELV'
                                                                                                                                                                                                                                          
		DELETE Citas WHERE 
                                                                                                                                                                                                                                        
			CodCia = @CodCia 
                                                                                                                                                                                                                                         
			AND CedulaPaciente = @CedulaPaciente
                                                                                                                                                                                                                      
			AND Representado = @Representado
                                                                                                                                                                                                                          
			AND FechaCita = @FechaCita 
                                                                                                                                                                                                                               
			AND Silla = @Silla
                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                             
	IF @Accion = 'CON'
                                                                                                                                                                                                                                          
		UPDATE Citas SET Confirmada = 
                                                                                                                                                                                                                             
		case confirmada 
                                                                                                                                                                                                                                           
			when 0 then 1
                                                                                                                                                                                                                                             
			when 1 then 0
                                                                                                                                                                                                                                             
		end
                                                                                                                                                                                                                                                        
		WHERE 
                                                                                                                                                                                                                                                     
			CodCia = @CodCia 
                                                                                                                                                                                                                                         
			AND CedulaPaciente = @CedulaPaciente
                                                                                                                                                                                                                      
			AND Representado = @Representado
                                                                                                                                                                                                                          
			AND FechaCita = @FechaCita 
                                                                                                                                                                                                                               
			AND Silla = @Silla
                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                             
	IF @Accion = 'STA'
                                                                                                                                                                                                                                          
		IF @HoraCita = '999'
                                                                                                                                                                                                                                       
			UPDATE Citas SET StatusCita = 
                                                                                                                                                                                                                            
			case StatusCita 
                                                                                                                                                                                                                                          
				when 'P' then 'C'
                                                                                                                                                                                                                                        
				when 'C' then 'P'
                                                                                                                                                                                                                                        
			end
                                                                                                                                                                                                                                                       
			WHERE 
                                                                                                                                                                                                                                                    
				CodCia = @CodCia 
                                                                                                                                                                                                                                        
				AND CedulaPaciente = @CedulaPaciente
                                                                                                                                                                                                                     
				AND Representado = @Representado
                                                                                                                                                                                                                         
				AND FechaCita = @FechaCita 
                                                                                                                                                                                                                              
				AND Silla = @Silla
                                                                                                                                                                                                                                       
		ELSE
                                                                                                                                                                                                                                                       
			UPDATE Citas SET StatusCita = 
                                                                                                                                                                                                                            
			case StatusCita 
                                                                                                                                                                                                                                          
				when 'P' then 'C'
                                                                                                                                                                                                                                        
				when 'C' then 'P'
                                                                                                                                                                                                                                        
			end
                                                                                                                                                                                                                                                       
			WHERE 
                                                                                                                                                                                                                                                    
				CodCia = @CodCia 
                                                                                                                                                                                                                                        
				AND FechaCita = @FechaCita 
                                                                                                                                                                                                                              
				AND HoraCita = @HoraCita
                                                                                                                                                                                                                                 
				AND Silla = @Silla
                                                                                                                                                                                                                                       

                                                                                                                                                                                                                                                             

                                                                                                                                                                                                                                                             

                                                                                                                                                                                                                                                             
