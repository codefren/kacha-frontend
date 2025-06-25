package com.graphhopper.jsprit.optimroute;

/**
 * Arguments
 */
public class Arguments {

    

    static String InputFilePath;

    static String OuputFilePath;

    static String printArguments = "false";
    
    // Constructor
    public Arguments() {
        // System.out.println("En constructor de Argumentos");
    }

	public static void init(String[] args) {

        for (int i = 1; i < args.length; ++i) TreatArg(args[i]);
    }
    
    public static void TreatArg(String arg) {
        String[] argPart = arg.split("=");
        
        String key = argPart[0]; 
        
        String value = argPart[1]; 

        assignArgument(key, value);

    }
    
	public static void assignArgument(String key, String value) {
        
        if(Arguments.printArguments == "true") {
            // System.out.println("key = " + key.length() + " value = " + value);
        }
        switch (key) {
            case "print_arguments":
                // System.out.println("here");
                Arguments.printArguments = value;
                break;  
            case "input_file_path":
                Arguments.InputFilePath = value;
                break;
            case "output_file_path":
                Arguments.OuputFilePath = value;
                break;      
            default:
                // System.out.println("Invalid argument name '" + key + "'");
                break;
        }
        // if (key == "input_file_path") {
        //     System.out.println("asigno");
        //     Arguments.InputFilePath = value;
        // } else if (key == "output_file_path") {
        //     Arguments.InputFilePath = value;
        // }
        // else {
        //     // System.err.println("Invalid argument name '" + key + "'");
        //     // error("Invalid argument name '" + key + "'");
        // }

       
	}
    
}